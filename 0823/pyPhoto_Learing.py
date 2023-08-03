import matplotlib.pyplot as plt
import numpy as np
import os
import PIL
import matplotlib.pyplot as plt
import json
import tensorflowjs as tfjs

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
from keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.optimizers import Adam

import pathlib

data_dir = "..\\photo_img"   # 저장폴더
data_dir = pathlib.Path(data_dir)

#image_count = len(list(data_dir.glob('*/*.jpg')))
#image_count += len(list(data_dir.glob('*/*.png')))
#print(image_count)

#폴더에 있는 그림 출력하기
#roses = list(data_dir.glob('roses/*'))
#print(str(roses[1]))
#picture=PIL.Image.open(str(roses[1]))
#ishape=np.array(picture)
#print(ishape.shape)
#picture.show()


batch_size = 32
img_width = 400
img_height = 500

###############################################################################
# 학습,검증데이터 로드 tf.data.Dataset
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
  data_dir,
  validation_split=0.2,
  subset="validation",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)
print(train_ds.element_spec)

class_names = train_ds.class_names
print(class_names)
"""
plt.figure(figsize=(10, 10))
for images, labels in train_ds.take(1):     #몇개의 batch를 가져올지
    for i in range(9):
        ax = plt.subplot(3, 3, i + 1)
        plt.imshow(images[i].numpy().astype("uint8"))
        plt.title(class_names[labels[i]])
        plt.axis("off")
plt.show()
plt.imshow(images[0].numpy().astype("uint8"))
plt.show()
"""
##################################################################################

##성능을 높이도록 데이터세트 구성하기
AUTOTUNE = tf.data.experimental.AUTOTUNE
train_ds = train_ds.cache().shuffle(1500).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

#데이터 표준화하기,0~1사이값으로 변환
normalization_layer = layers.experimental.preprocessing.Rescaling(1./255)

normalized_train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
normalized_val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))

# 하나의 batch를 선택해 평균값표시
[(temp_img, temp_label)] = normalized_train_ds.take(1)
first_image = temp_img[0]
print("norm_train_ds=",np.min(first_image),"~",np.average(first_image),"~",np.max(first_image))     #0.0 0.96902645

# 모델만들기 ##############################################################
num_classes = len(class_names)          #5
data_augmentation = keras.Sequential(
  [
    #layers.experimental.preprocessing.RandomFlip("horizontal", input_shape=(img_height, img_width, 3)),
    layers.experimental.preprocessing.RandomRotation(0.1),
    layers.experimental.preprocessing.RandomZoom(0.1),
  ]
)

model = Sequential([
    #data_augmentation,    #추가    
    ##layers.experimental.preprocessing.Rescaling(1./255, input_shape=(img_height, img_width, 3)),
    layers.Conv2D(16, 3, padding='same', activation='relu', input_shape=(img_height, img_width, 3)),
    layers.MaxPooling2D(),
    layers.Conv2D(32, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),
    layers.Dropout(0.2),  #추가
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(num_classes)
])


# 저장된 가중치부터 학습 시작 
weights_path = "../model/model.hdf5"

if os.path.exists(weights_path): #가중치 파일이 있으면 
    model.load_weights(weights_path)
    print("Weights loaded successfully.")
else: #가중치 파일이 없으면 
    print("Weights file not found. Starting with random weights.")
# 계속 수행

optimizer = Adam(learning_rate=0.0001)
#모델 컴파일하기
model.compile(optimizer=optimizer,
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
model.summary()

####################################################################################
#모델 훈련하기
#0~1사이의 float32
#(n,height,width,3)
print(train_ds.element_spec)

[(temp_img, temp_label)] = normalized_train_ds.take(1)
show_img=temp_img[0].numpy()*255
plt.imshow(show_img.astype("uint8"))
plt.show()

epochs=5

model_path = '../model/' + 'model-' + '-{epoch:04d}-{val_loss:.4f}.hdf5'
cb_checkpoint = ModelCheckpoint(filepath=model_path, monitor='val_loss',
                                verbose=1, save_best_only=True)
#cb_early_stopping = EarlyStopping(monitor='val_loss', patience=10)
history = model.fit(
  normalized_train_ds,
  validation_data=normalized_val_ds,
  epochs=epochs,
  batch_size=50, verbose=1, callbacks=[cb_checkpoint]
)

model.save("../model/"+"model.hdf5")

#모델만 저장=>json
"""
model_json = model.to_json()
with open("../model/"+"model_only.json", "w") as json_file :
	json_file.write(model_json)

#weights만 저장=>HDf5
model.save_weights("../model/"+"weights_only.hdf5")
##weight 출력 test
print('model weight :', model.get_weights())
"""
# 모델을 TensorFlow.js Layers Model 형식으로 변환
tfjs_layers_model_format = '../model/model_tfjs'
tfjs.converters.save_keras_model(model, tfjs_layers_model_format)

# 모델의 클래스 이름을 저장합니다
class_names_json = json.dumps(class_names)
with open('../model/class_names.json', 'w') as f:
    f.write(class_names_json)

#훈련 결과 시각화하기
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

loss=history.history['loss']
val_loss=history.history['val_loss']

epochs_range = range(epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.show()
############################################################################

#test 성능평가
score = model.evaluate(val_ds, verbose=0) # test 값 결과 확인
print('Test loss:', score[0])
print('Test accuracy:', score[1])









import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import upload from '../Images/upload.png';

const ModelFileURL = '../model/model--0005-0.3897.hdf5';

const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'];
// 분류할 카테고리 목록
let model = null; // 모델 변수를 모듈 레벨로 이동

const ImageClassifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedCategory, setPredictedCategory] = useState('');

  const loadModel = async () => {
    try {
      model = await tf.loadLayersModel(ModelFileURL); // 모델 변수에 할당
    } catch (error) {
      console.error('Error while loading the model:', error);
    }
  };

  useEffect(() => {
    loadModel().then(() => {
      // 모델이 로드된 후에 수행할 작업
    });
  }, []);

  const handleImageFileChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile && imageFile.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(imageFile));
      classifyImage(imageFile);
    } else {
      setSelectedImage(null);
      setPredictedCategory('');
    }
  };

  const classifyImage = async (img) => {
    try {
      if (!img || !model) {
        console.error('Invalid input image or model not loaded.');
        return;
      }

      const imageTensor = tf.browser.fromPixels(img).resizeBilinear([224, 224]).expandDims();
      const predictions = model.predict(imageTensor);
      const categoryIndex = predictions.argMax(1).dataSync()[0];
      setPredictedCategory(categories[categoryIndex]);
    } catch (error) {
      console.error('Error while classifying image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageFileChange} />
      {selectedImage ? (
        <img style={{ width: '300px' }} src={selectedImage} alt="Selected" />
      ) : (
        <img style={{ width: '300px', opacity: 0.5 }} src={upload} alt="Upload" />
      )}
      {predictedCategory && <div>Predicted Category: {predictedCategory}</div>}
    </div>
  );
};

export default ImageClassifier;

import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

function YourComponent() {
  const [model, setModel] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState('');

  useEffect(() => {
    // 모델 로드
    async function loadModel() {
      const modelUrl = 'http://localhost:8000/model_tfjs/model.json';
      const loadedModel = await tf.loadLayersModel(modelUrl);
      setModel(loadedModel);
    }

    loadModel();
  }, []);

  // 로드된 모델을 사용하여 예측 수행
  async function predictImage(image) {
    if (!model) return; // 모델이 로드되지 않았을 때는 함수를 종료

    const img = tf.browser.fromPixels(image).resizeNearestNeighbor([500, 400]).toFloat();
    const expandedImg = img.expandDims(0);
    const normalizedImg = expandedImg.div(255.0);

    const predictions = model.predict(normalizedImg);
    const predictionIndex = tf.argMax(predictions, 1).dataSync()[0];

    // class_names는 클래스 이름들을 담고 있는 배열로 가정합니다.
    // class_names.json에서 class_names를 불러옵니다.
    const classNames = ['body', 'dog', 'family', 'profile_big', 'wedding'];
    const predictedClass = classNames[predictionIndex];

    setPredictionResult(predictedClass);
  }

  // 이미지 업로드 핸들러
  function handleImageUpload(event) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    // 이미지 예측 수행 (모델이 로드된 이후에만 호출)
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.onload = () => predictImage(imageElement);
  }

  // React 컴포넌트 코드
  return (
    <div>
      {/* 이미지 업로드 입력 */}
      <input type="file" onChange={handleImageUpload} />

      {/* 업로드된 이미지 표시 */}
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" width="300" height="200" />}

      {/* 예측 결과 표시 */}
      {predictionResult !== null ? (
        <p>Prediction: {predictionResult}</p>
      ) : (
        <p>Prediction: No result</p>
      )}

    </div>
  );
}

export default YourComponent;

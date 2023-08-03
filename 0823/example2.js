import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl'; // 웹 브라우저에서 WebGL 백엔드 사용

function ImageClassificationApp() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const classLabels = {
    0: 'body',
    1: 'dog',
    2: 'family',
    3: 'profile_big',
    4: 'wedding',
  };

  useEffect(() => {
    // 모델 로드
    const modelUrl = './model_tfjs/model.json';
    async function loadModel() {
      const model = await tf.loadLayersModel(modelUrl);
      setModel(model);
    }
    loadModel();
  }, []);

  const [model, setModel] = useState(null);

  // 이미지 분류 함수
  const classifyImage = async (img) => {
    try {
      if (!model) {
        console.error('Model not loaded yet.');
        return null;
      }

      const imageData = await getImageData(img);
      const tensorImg = tf.browser.fromPixels(imageData).toFloat();
      const resizedImg = tf.image.resizeBilinear(tensorImg, [500, 400]); // 이미지 크기를 [500, 400]로 조정
      const expandedImg = resizedImg.expandDims();
      const normalizedImg = expandedImg.div(255.0);
      const prediction = await model.predict(normalizedImg).array();
      const classIndex = prediction[0].indexOf(Math.max(...prediction[0]));
      return classIndex;
    } catch (error) {
      console.error('Error classifying the image:', error);
      return null;
    }
  };

  // 이미지 파일을 ImageData로 변환하는 함수
  const getImageData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          resolve(imageData);
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event) => {
    const uploadedImage = event.target.files[0];
    setImage(uploadedImage);
  };

  const handlePredict = async () => {
    if (image) {
      const classIndex = await classifyImage(image);
      const predictedLabel = classLabels[classIndex];
      setPrediction(predictedLabel);
    }
  };

  return (
    <div>
      <h1>이미지 분류 앱</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handlePredict}>이미지 분류</button>
      {prediction !== null && (
        <p>이미지는 {prediction}번 클래스에 속합니다.</p>
      )}
    </div>
  );
}

export default ImageClassificationApp;

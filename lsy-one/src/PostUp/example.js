import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import * as tf from '@tensorflow/tfjs';

const ImageClassificationApp = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const classLabels = ['body', 'dog', 'family', 'profile_big', 'wedding'];

  // 모델을 로드하는 함수
  const loadModel = async () => {
    const model = await tf.loadLayersModel('../model/model.hdf5');
    return model;
  };

  // 이미지 분류 함수
  const classifyImage = async (file) => {
    if (!file) return;

    const image = await tf.browser.fromPixels(file);
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);
    const preprocessedImage = resizedImage.div(255.0).expandDims(0);

    const model = await loadModel();
    const predictions = await model.predict(preprocessedImage);
    const predictionResult = await getPredictionResult(predictions);

    setPredictionResult(predictionResult);
  };


  
  // 예측 결과 가져오기
  const getPredictionResult = async (predictions) => {
    const topK = 1; // 상위 1개 클래스만 가져옴
    const values = await predictions.data();
    const indices = Array.from(values).map((value, index) => [value, index]);
    const sortedIndices = indices.sort((a, b) => b[0] - a[0]).slice(0, topK);
    const predictionResult = sortedIndices.map(index => {
      const probability = index[0];
      const classIndex = index[1];
      const className = classLabels[classIndex]; // 클래스 레이블
      return { className, probability };
    });

    return predictionResult;
  };

  const handleDrop = (acceptedFiles) => {
         const imageFile = acceptedFiles[0];
       
         // FileReader를 사용하여 이미지 데이터 추출
         const reader = new FileReader();
         reader.onload = (event) => {
           const image = new Image();
           image.onload = () => {
             classifyImage(image);
           };
           image.src = event.target.result;
         };
         reader.readAsDataURL(imageFile);
       };
       

  return (
    <div>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={{ width: 300, height: 300, border: '1px solid black' }}>
            <input {...getInputProps()} />
            <p>이미지를 여기에 드래그 또는 클릭하여 업로드하세요.</p>
          </div>
        )}
      </Dropzone>
      {predictionResult && (
        <div>
          <h3>분류 결과:</h3>
          <p>예측된 클래스: {predictionResult[0].className}</p>
          <p>확신도: {predictionResult[0].probability.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default ImageClassificationApp;

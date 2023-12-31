import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs'; // npm i @tensorflow/tfjs
import '@tensorflow/tfjs-backend-webgl'; // npm i @tensorflow/tfjs-backend-webgl
import Logo from '../Component/Header';
import { useNavigate } from 'react-router-dom';

import upload from '../Images/upload.png';

import styled from 'styled-components';
//수정된곳(0916)
//모델파일 사용안함 
//거리 기반 유사도(유클리디안 유사도)
//값은 0~무한대로 표현
//이미지 크기(250,250)
function CosineExs() {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [model, setModel] = useState(null);
  const [imagePaths, setImagePaths] = useState([]); 
  const classLabels = ['body', 'dog', 'family', 'profile', 'wedding', 'unknown'];

  const navigate = useNavigate();

  useEffect(() => {
    // 모델 로드
    const modelUrl = './model_tfjs/model.json';
    async function loadModel() {
      const model = await tf.loadLayersModel(modelUrl);
      setModel(model);
    }
    loadModel();
  }, []);

  const getImageData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // 권한 설정
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
  const classifyImageData = async (img, threshold) => {
         try {
           if (!model) {
             console.error('Model not loaded yet.');
             return null;
           }
     
           const imageData = await getImageData(img);
           const tensorImg = tf.browser.fromPixels(imageData).toFloat();
           const resizedImg = tf.image.resizeBilinear(tensorImg, [500, 400]);
           const expandedImg = resizedImg.expandDims();
           const normalizedImg = expandedImg.div(255.0);
           const prediction = await model.predict(normalizedImg).array();
     
           const softmaxPrediction = tf.softmax(tf.tensor(prediction)).arraySync()[0];
           const maxProb = Math.max(...softmaxPrediction);
           const classIndex = softmaxPrediction.indexOf(maxProb);
     
           if (maxProb >= threshold) {
             console.log('Predictions with Softmax:');
             softmaxPrediction.forEach((prob, classIndex) => {
               console.log(`${classLabels[classIndex]}: ${prob * 100}%`);
             });
             return classIndex;
           } else {
             console.log('Predictions with Softmax:');
             softmaxPrediction.forEach((prob, idx) => {
               console.log(`${classLabels[idx]}: ${prob * 100}%`);
             });
             console.log(`Predicted as: 해당없음 (Threshold: ${threshold * 100}%)`);
             return -1;
           }
         } catch (error) {
           console.error('Error classifying the image:', error);
           return null;
         }
       };
  const prepareInputImageTensor = async (imageFile) => {
    if (
      imageFile &&
      (imageFile.type === 'image/jpeg' ||
        imageFile.type === 'image/png' ||
        imageFile.type === 'image/jpg') &&
      imageFile.size <= 30 * 1024 * 1024
    ) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (event) => {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // 권한 설정
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const tensorImg = tf.browser.fromPixels(ctx.getImageData(0, 0, img.width, img.height)).toFloat();
            const resizedImg = tf.image.resizeBilinear(tensorImg, [250, 250]);
            const expandedImg = resizedImg.expandDims();
            const normalizedImg = expandedImg.div(255.0);
            resolve(normalizedImg);
          };
          img.src = event.target.result;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
      });
    } else {
      return null;
    }
  };

  const calculateEuclideanDistanceBetweenTensors = (tensorA, tensorB) => {
         const squaredDiff = tensorA.sub(tensorB).square();
         const sum = squaredDiff.sum();
         const euclideanDistance = sum.sqrt();
         return euclideanDistance.arraySync(); // .arraySync()를 호출하여 텐서를 일반 JavaScript 배열로 변환
       };
       

  const calculateEuclideanSimilarity = async (inputImageTensor) => {
    try {
      if (!inputImageTensor || !imagePaths) {
        console.error('Input data not available.');
        return null;
      }

      const similarImages = [];
      for (const imagePath of imagePaths) {
        const folderImageData = await getImageDataFromPath(imagePath);
        const folderTensorImg = tf.browser.fromPixels(folderImageData).toFloat();
        const folderResizedImg = tf.image.resizeBilinear(folderTensorImg, [250, 250]);
        const folderExpandedImg = folderResizedImg.expandDims();
        const folderNormalizedImg = folderExpandedImg.div(255.0);

        const euclideanDistance = calculateEuclideanDistanceBetweenTensors(
          inputImageTensor,
          folderNormalizedImg
        );

        console.log('Euclidean Distance:', euclideanDistance);
        similarImages.push({ imagePath, euclideanDistance });
      }

      // 유클리디안 거리에 따라 유사한 이미지 정렬
      similarImages.sort((a, b) => a.euclideanDistance - b.euclideanDistance);

      // 상위 3개 유사한 이미지 선택
      const topSimilarImages = similarImages.slice(0, 3);

      console.log('상위 유사한 이미지:', topSimilarImages);
      return topSimilarImages; // 상위 유사한 이미지를 반환
    } catch (error) {
      console.error('유클리디안 거리 계산 중 오류:', error);
    }
  };

  const getImageDataFromPath = async (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 권한 설정
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
      img.src = imagePath;
    });
  };

  const handleImageFileChange = async (event) => {
    const imageFile = event.target.files[0];
    if (
      imageFile &&
      (imageFile.type === 'image/jpeg' ||
        imageFile.type === 'image/png' ||
        imageFile.type === 'image/jpg') &&
      imageFile.size <= 30 * 1024 * 1024
    ) {

      setImageFile(imageFile);
      setPreviewImage(URL.createObjectURL(imageFile));
 

      const classIndex = await classifyImageData(imageFile, 0.8); // 0.8 프로의 정확도가 임계값
 
      const predictedLabel = classLabels[classIndex];
     

      // 이미지 경로를 서버에서 가져옴
      fetch(`http://localhost:4004/api/${predictedLabel}`)
        .then((response) => response.json())
        .then((data) => {
          setImagePaths(data.map((imagePath) => `http://localhost:4004${imagePath}`));
          console.log('Received image paths:', data);
        })
        .catch((error) => {
          console.error('Error fetching image paths:', error);
 
        });
    } else {
      setImageFile(null);
      setPreviewImage(null);
    }
  };

  const handleEuclideanCalculation = async () => {
    try {
      const inputImageTensor = await prepareInputImageTensor(imageFile);

      if (!inputImageTensor) {
        console.error('Input image tensor not available.');
        return;
      }

      const topSimilarImages = await calculateEuclideanSimilarity(inputImageTensor);

      // 여기에서 유사한 이미지를 `/upload` 페이지로 전달하고 이동합니다.
      if (topSimilarImages) {
        // 유사한 이미지가 존재할 경우에만 전달 및 이동
        navigate('/recoresult', { state: { topSimilarImages } });
      }
    } catch (error) {
      console.error('Error calculating euclidean similarity:', error);
    }
  };

  return (
    <OutWrap>
      <InOutWrap>
        {/* 로고 */}
        <Logo />
        {/* 컨텐츠 */}
        <Center>
          <InLayoutOne>
            <Content>
              <Five>
                {previewImage && (
                  <SelectImg src={previewImage} alt="upload" />
                )}
                {/* 업르드시 보이는 사진 */}
                {!previewImage && (
                  <EmptyImg src={upload} alt="up" />
                )}
                {/* 빈 이미지 로고 그림인데 업로드 하면 없어진 */}

                <FindImg onClick={() => document.getElementById('file-upload').click()}>
                  파일 찾기
                </FindImg>

                <InputBox
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                {/* 위 아래  파일찾기  버튼, 이미지 셀렉 하면 없어진다. */}
              </Five>
            </Content>
          </InLayoutOne>

          <InLayoutTwo>
            <ButtonTwo style={{ marginRight: 10 }} onClick={handleEuclideanCalculation}>
              결과보기
            </ButtonTwo>
          </InLayoutTwo>
        </Center>
      </InOutWrap>
    </OutWrap>
  );
}

export default CosineExs;

     
     const OutWrap = styled.div`
       width: 100%;
       height: 100%;
       background: white;
       //position: relative;
       align-items: center;
       display: flex;
       flex-direction: column;
      // justify-content: center;
     
     // 가운데로 
      position: absolute;
        // top: 50%;
         //left: 50%;
         //transform: translate(-50%, -50%);
      
       * {
       font-size: 33px;
       }
       /* mobile 규격 */
       @media screen and (max-width: 540px){
       * {
       font-size: 27px;
       }
         
       }
       @media screen and (min-width: 1700px) {
       * {
         font-size: 45px;
       }
     `;
     const InOutWrap = styled.div`
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     width: 65%;
     height:100%;
     
     /* tablet 규격 */
       @media screen and (max-width: 1023px){
         width: 75%;
       }
     /* mobile 규격 */
       @media screen and (max-width: 540px){
         width: 90%;
       }
       /* s 데스크 */
       @media screen and (min-width: 1024px){
           
       }
       /* l 데스크 */
       @media screen and (min-width: 1700px){
           
       }
     `;
     
     
     const Center = styled.div`
     width: 100%;
     height:80%;
     display: flex;
     flex-direction: column;
     align-items: center;
     `;
     const InLayoutOne = styled.div`
     width:100%;
     height:85%
     `;
     const Content = styled.div`
     width:100%;
     height:100%;
     display: flex;
     flex-direction: column;
     `;
     
       const SelectImg = styled.img`
       width: 100%;
       height: 100%;
       object-fit: contain;
       `;
     
       const EmptyImg = styled.img`
       width: 150px;
       height: 150px;
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       
       /* tablet 규격 */
         @media screen and (max-width: 1023px){
             
         }
     
         /* mobile 규격 */
         @media screen and (max-width: 540px){
             
         }
         /* s 데스크 */
         @media screen and (min-width: 1024px){
             
         }
         /* l 데스크 */
         @media screen and (min-width: 1700px){
           width: 200px;
           height: 200px;
         }
       `;
     
     const InLayoutTwo = styled(InLayoutOne)`
     display: flex;
     width:100%;
     height:15%;
     justify-content: flex-end;
     align-items: center;
     
     `;
     
     const InputBox = styled.input`
     display: none;
     `;
     
     
     const ContentRadius = styled.div`
     border: 3px #3A76EF solid;
     padding: 20px;
     word-wrap: break-word;
     border-radius: 31px;
     box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
     
     
     box-sizing:border-box;
     
     @media screen and (max-width: 1600px) {
       border: 3px #3A76EF solid;
       };
       
       @media screen and (max-width: 540px) {
       margin-top: 15px;
       border: 2px #3A76EF solid;
       };
       
       @media screen and (min-width: 1601px) {
       margin-top: 30px;
       border: 4px #3A76EF solid;
     `;
     
     
     
     const Five = styled(ContentRadius)`
     position: relative;
     width:100%;
     height:100%;
     `;
       
     const Radius = styled.button`
     padding: 20px;
     word-wrap: break-word;
     border-radius: 40px;
     box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
     border:none;
     background: #798BE6;
     display: flex;
     align-items: center;
     justify-content: center;
     position: relative;
     cursor: pointer;
     color: white;
     `;
     
     // 버튼투
     const ButtonTwo = styled(Radius)`
       width:30%;
       height: 70%; 
     
       /* tablet 규격 */
       @media screen and (max-width: 1023px){
         width:40%;
         
       }
       /* mobile 규격 */
       @media screen and (max-width: 540px){
         width:55%;
       }
     
       /* s 데스크 */
       @media screen and (min-width: 1024px){
           
       }
       @media screen and (min-width: 1700px) {
       
       };
      `;
     const FindImg = styled(ButtonTwo)` 
       position: absolute;
       bottom: 30px;
       right: 10px;
     
       width:30%;
       height:12.5%;
     
       /* tablet 규격 */
       @media screen and (max-width: 1023px){
         width:40%;
         
       }
       /* mobile 규격 */
       @media screen and (max-width: 540px){
         width:55%;
         height: 13%; 
         bottom: 20px;
     
       }
     
       /* s 데스크 */
       @media screen and (min-width: 1024px){
           
       }
       @media screen and (min-width: 1700px) {
          
       };
     
     `;
     
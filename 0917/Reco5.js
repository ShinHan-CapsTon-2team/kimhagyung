import React, { useState, useEffect ,useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs'; //npm i @tensorflow/tfjs
import '@tensorflow/tfjs-backend-webgl'; //npm i @tensorflow/tfjs-backend-webgl
//useRef, useCallback
import Logo from '../Component/Header' 
import { useNavigate } from 'react-router-dom';

import upload from '../Images/upload.png'; 
  
//수정된곳(0917)
//모델파일 사용함 
//거리 기반 유사도(유클리디안 유사도)
import styled from "styled-components";

function CosineExs() { 
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 URL 상태
    const [model, setModel] = useState(null);
    const [imagePaths, setImagePaths] = useState([]); //이미지 경로 가져오기 
    const imagePathsInFolder = imagePaths; 
    
    const classLabels = [
      'body',
      'dog',
      'family',
      'profile',
      'wedding',
      'unknown'
    ];
 
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


    
      
     // 이미지 분류 함수 (소프트맥스 함수 사용)
const classifyImageData  = async (img, threshold) => {
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

      // 소프트맥스 함수 적용하여 확률로 변환
      const softmaxPrediction = tf.softmax(tf.tensor(prediction)).arraySync()[0];

      // 예측 확률 중 가장 높은 값과 해당 클래스 인덱스 가져오기
      const maxProb = Math.max(...softmaxPrediction);
      const classIndex = softmaxPrediction.indexOf(maxProb);

      // 특정 임계값 이상인 경우 해당 클래스 레이블 반환, 그렇지 않으면 "해당없음"
      if (maxProb >= threshold) {
          // 각 클래스 레이블과 예측 확률을 함께 콘솔에 출력
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
        return -1; // -1을 반환하여 "해당없음" 클래스를 나타냄
    }
  } catch (error) {
      console.error('Error classifying the image:', error);
      return null;
  }
};


      
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


// calculateCosineSimilarity 함수 내부
const calculateEuclideanSimilarity = async () => {
  try {
    if (!model || !imageFile) {
      console.error('모델 또는 이미지를 사용할 수 없습니다.');
      return;
    }

    // 이미지 데이터를 캔버스에 로드
    const canvas = document.createElement('canvas');
    const imageData = await getImageData(imageFile);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);

    // 미리 학습된 모델을 사용하여 예측 벡터 계산
    const tensorImg = tf.browser.fromPixels(imageData).toFloat();
    const resizedImg = tf.image.resizeBilinear(tensorImg, [500, 400]);
    const expandedImg = resizedImg.expandDims();
    const normalizedImg = expandedImg.div(255.0);
    const pretrainedPrediction = await model.predict(normalizedImg).array();
    const pretrainedImageTensor = tf.tensor(pretrainedPrediction);

    // 폴더 내에 있는 다른 이미지들과의 유클리디안 거리 계산
    const similarImages = [];
    for (const imagePath of imagePathsInFolder) {
      const folderImageData = await getImageDataFromPath(imagePath);
      const folderTensorImg = tf.browser.fromPixels(folderImageData).toFloat();
      const folderResizedImg = tf.image.resizeBilinear(folderTensorImg, [500, 400]);
      const folderExpandedImg = folderResizedImg.expandDims();
      const folderNormalizedImg = folderExpandedImg.div(255.0);
      const folderPrediction = await model.predict(folderNormalizedImg).array();
      const folderImageTensor = tf.tensor(folderPrediction);
      const euclideanDistance = calculateEuclideanDistanceBetweenTensors(pretrainedImageTensor, folderImageTensor);
      console.log('Euclidean Distance:', euclideanDistance);
      similarImages.push({ imagePath, euclideanDistance });
    }

    // 유클리디안 거리에 따라 유사한 이미지 정렬
    similarImages.sort((a, b) => a.euclideanDistance - b.euclideanDistance);

    // 상위 3개 유사한 이미지 선택
    const topSimilarImages = similarImages.slice(0, 3);

    console.log("상위 유사한 이미지:", topSimilarImages);
    return topSimilarImages; // 상위 유사한 이미지를 반환

  } catch (error) {
    console.error('유클리디안 거리 계산 중 오류:', error);
  }
};


//c-upload 선택시
const handleCosineCalculation = async () => {
  try {
      const topSimilarImages = await calculateEuclideanSimilarity ();

      // 여기에서 유사한 이미지를 `/upload` 페이지로 전달하고 이동합니다.
      if (topSimilarImages) { // 유사한 이미지가 존재할 경우에만 전달 및 이동
         navigate('/recoresult', { state: { topSimilarImages } });
      }

  } catch (error) {
      console.error('Error calculating cosine similarity:', error);
  }
};


// 두 텐서 간의 유클리디안 거리 계산
const calculateEuclideanDistanceBetweenTensors = (tensorA, tensorB) => {
  const squaredDifferences = tf.square(tf.sub(tensorA, tensorB));
  const sumSquaredDifferences = tf.sum(squaredDifferences);
  const euclideanDistance = tf.sqrt(sumSquaredDifferences).arraySync();
  return euclideanDistance;
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
        const reader = new FileReader();
        reader.onload = async (event) => {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // 권한 설정
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
    
            setImageFile(imageFile);
            setPreviewImage(URL.createObjectURL(imageFile));

            const classIndex = await classifyImageData(imageFile, 0.8); //0.8프로의정확도가 임계값
           
            const predictedLabel = classLabels[classIndex];
         

            // 이미지 경로를 서버에서 가져옴
            fetch(`http://localhost:4004/api/${predictedLabel}`)
                  .then(response => response.json())
                  .then(data => {
                      setImagePaths(data.map(imagePath => `http://localhost:4004${imagePath}`));
                      console.log('Received image paths:', data);
                    })
            .catch(error => {
                console.error('Error fetching image paths:', error);
            });
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
      } else {
        setImageFile(null);
        setPreviewImage(null);
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
                           )}{/* 업르드시 보이는 사진 */}
                   
                       {!previewImage && (
                           <EmptyImg src={upload} alt="up" />        
                       )}{/* 빈 이미지 로고 그림인데 업로드 하면 없어진 */}
     
     
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
                   <ButtonTwo  style={{marginRight:10}}onClick={handleCosineCalculation}>
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
     
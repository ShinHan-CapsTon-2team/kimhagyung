
import React, { useState, useEffect ,useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs'; //npm i @tensorflow/tfjs
import '@tensorflow/tfjs-backend-webgl'; //npm i @tensorflow/tfjs-backend-webgl
//useRef, useCallback
import logo from '../Images/imagelogo.png';
import { useNavigate } from 'react-router-dom';

import upload from '../Images/upload.png';
import f_file from '../Images/f-file.png';
import c_upload from '../Images/com_upload.png';

//import Inputtitle from './InTitle' 컴포넌트 

import styled from "styled-components";

function CosineEx() {
    const [category, setCategory] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 URL 상태
    const [prediction, setPrediction] = useState(null);
    const [selectedClass, setSelectedClass] = useState(0); // 선택한 클래스의 인덱스
    const [model, setModel] = useState(null);
    const [imagePaths, setImagePaths] = useState([]); //이미지 경로 가져오기 
    const [error, setError] = useState(null);
    const imagePathsInFolder = imagePaths; 
    const classLabels = [
      '바디프로필',
      '반려동물',
      '가족사진',
      '증명사진',
      '웨딩사진',
    ];
    const navigate = useNavigate();

    //홈페이지
    const handleGohomeClick = () => {
        navigate('/home');
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

      useEffect(() => {
        fetch('http://localhost:4000/api/files')
        .then(response => response.json())
        .then(data => {
          setImagePaths(data.map(imagePath => `http://localhost:4000${imagePath}`));
          console.log('Received image paths:', data);
        })
        .catch(error => {
          console.error('Error fetching image paths:', error);
          setError(error);
        });
      
      }, []);
      
    
      const classifyImageData = async (canvas) => {
        try {
          if (!model) {
            console.error('Model not loaded yet.');
            return null;
          }
      
          const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
          const tensorImg = tf.browser.fromPixels(imageData).toFloat();
          const resizedImg = tf.image.resizeBilinear(tensorImg, [500, 400]);
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
const calculateCosineSimilarity = async () => {
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

    // 폴더 내에 있는 다른 이미지들과의 코사인 유사도 계산
    const similarImages = [];
    for (const imagePath of imagePathsInFolder) {
      const folderImageData = await getImageDataFromPath(imagePath);
      const folderTensorImg = tf.browser.fromPixels(folderImageData).toFloat();
      const folderResizedImg = tf.image.resizeBilinear(folderTensorImg, [500, 400]);
      const folderExpandedImg = folderResizedImg.expandDims();
      const folderNormalizedImg = folderExpandedImg.div(255.0);
      const folderPrediction = await model.predict(folderNormalizedImg).array();
      const folderImageTensor = tf.tensor(folderPrediction);
      const cosineSimilarity = calculateCosineSimilarityBetweenTensors(pretrainedImageTensor, folderImageTensor);
      similarImages.push({ imagePath, cosineSimilarity });
    }

    // 코사인 유사도에 따라 유사한 이미지 정렬
    similarImages.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);

    // 상위 3개 유사한 이미지 선택
    const topSimilarImages = similarImages.slice(0, 3);

    console.log("상위 유사한 이미지:", topSimilarImages);

    // 여기에서 사용자에게 유사한 이미지를 보여줄 수 있습니다.

  } catch (error) {
    console.error('코사인 유사도 계산 중 오류:', error);
  }
};

// 두 텐서 간의 코사인 유사도 계산
const calculateCosineSimilarityBetweenTensors = (tensorA, tensorB) => {
  const cosineSimilarity = tf.losses.cosineDistance(tensorA, tensorB).arraySync();
  return 1 - cosineSimilarity; // 코사인 유사도를 유사도 점수로 변환
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



    // c-upload 버튼 클릭 시 실행되는 함수
    const handleCosineCalculation = () => {
        calculateCosineSimilarity();
    };


    const handleMenuToggle = () => { //메뉴열기/닫기
        setIsMenuOpen(!isMenuOpen);
    };


    /*카테고리*/
    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
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
            setPreviewImage(event.target.result);
    
            // 이미지 파일이 업로드되면 예측 수행
            const classIndex = await classifyImageData(canvas);
            setSelectedClass(classIndex);
            const predictedLabel = classLabels[classIndex];
            setPrediction(predictedLabel);
            setCategory(classLabels[classIndex]); // 카테고리를 예측된 클래스로 설정
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
                {/* 홈페이지 로고 같*/}        
                <LogoWrap>
                    <Logo src={logo} alt='' onClick={handleGohomeClick}/>
                </LogoWrap>
                {/* 로고 아래 */} 

                <Center>                   
                    <InLayoutOne>  
                        <Content> 
                            <Five>{/* 이미지 */}
                                {!previewImage && (
                                    <EmptyImg src={upload} alt="upload" />
                                )} {/*빈 이미지로 사진 올리면 없어짐 */}

                                <FindImg  src={f_file} alt="f_file" onClick={() => document.getElementById('fileInput').click()}/>
                                <FileBox 
                                    id="fileInput"
                                    type="file"
                                    accept="image/jpg, image/png ,image/jpeg"
                                    onChange={handleImageFileChange} 
                                />

                                {previewImage && 
                                <SelectImg src={previewImage} alt="Preview" />} 
                                
                            </Five>

                        </Content>  
                    </InLayoutOne>  

                    <InLayoutTwo>
                    
                        <Buttons>
                            <Left>
                                <ButtonOne onClick={handleMenuToggle}> {/*카테고리 */}
                                
                                {category ? (
                                    <Menu>{category}</Menu>
                                ) : (
                                    <Menu>카테고리 선택</Menu>
                                )}

                                <DropContainer>                               
                                    {isMenuOpen && (
                                    <DropMenu > {/* 스타일 수정 */}
                                        <CateMenu onClick={() => handleCategorySelect(classLabels[0])}>{classLabels[0]}</CateMenu>
                                        <CateMenu onClick={() => handleCategorySelect(classLabels[1])}>{classLabels[1]}</CateMenu>
                                        <CateMenu onClick={() => handleCategorySelect(classLabels[2])}>{classLabels[2]}</CateMenu>
                                        <CateMenu onClick={() => handleCategorySelect(classLabels[3])}>{classLabels[3]}</CateMenu>
                                        <CateMenu onClick={() => handleCategorySelect(classLabels[4])}>{classLabels[4]}</CateMenu>   
                                    </DropMenu>
                                    )}

                                </DropContainer>

                                </ButtonOne>
                            </Left>

                            <Right> 
                                <ButtonTwo>
                                    <UploadFinally
                                    className="c-upload"
                                    src={c_upload}
                                    alt=""
                                    onClick={handleCosineCalculation} 
                                        />
                                </ButtonTwo>
                            </Right>
                        </Buttons>
                    </InLayoutTwo>               
                </Center>
                
            </InOutWrap>
        </OutWrap>
    );
}

export default CosineEx;

const OutWrap = styled.div`
width: 100%;
height: 97.6vh;

position: relative;

background: white;

display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;

//overflow: hidden;
`;

const InOutWrap = styled.div`
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const LogoWrap = styled.div`
width: 30vw; 
height: 26vh;
  text-align: center;
display: flex;
flex-direction: column;
align-items: center;

@media screen and (min-height: 900px) {
    width: 32vw; 
    height: 29vh;
};
`;

const Logo = styled.img`
width: 29vw; 
height: 25vh;

@media screen and (min-height: 900px) {
    width: 31vw; 
    height: 28vh; 
}`;

const Center = styled.div`
//width: 65vw;
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
`;

const InLayoutOne = styled.div`
text-align:center;
width:65vw;

@media screen and (min-width: 1700px) {
    width: 75vw;
};
`;

const InLayoutTwo = styled(InLayoutOne)`
display: flex;
width:65vw;
height:15vh;

@media screen and (min-width: 1700px) {
    width: 75vw;
};
`;

const Content = styled.div`
//width:65vw;
display: flex;
flex-direction: column;
`;

const ContentRadius = styled.div`
border: 3px #3A76EF solid;
padding: 20px;
word-wrap: break-word;
opacity: 0.90;
border-radius: 31px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

margin-top: 20px;

@media screen and (min-height: 900px) {
    margin-top: 30px;
    border: 4px #3A76EF solid;
};
`;

const Radius = styled.div`
//border: 3px #3A76EF solid;
padding: 20px;
word-wrap: break-word;
border-radius: 40px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

margin-top: 20px;

`;
// 색깔 탁하게 하는 주범 이 새기임 opacity: 0.90;
const One = styled(ContentRadius)`
display: flex;
align-items: center;


`;
const Five = styled(ContentRadius)`

position: relative;

overflow: hidden;
text-align: center;
height:75vh;
`;


const Left = styled.div`
width: 65%;
display: flex;
justify-content: center;
`;

const Right = styled.div`
display: flex;
flex-direction: column;
//margin-left: auto;
flex:1
`;

const Buttons = styled.div`
  text-align: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const ButtonOne = styled(Radius)`
background: #798BE6;
margin-top: 20px;
cursor: pointer;
display: flex;
align-items: center;
position: relative;
justify-content: center;

width: 40vw;
height: 3.3vh;

@media screen and (min-width: 1700px) {
    width: 50vw;
};

`;

const Area = styled.div`
display: flex;
align-items: center;
width: 100%;
border-radius: 31px;
overflow: hidden; 
`;

const SmallWrap = styled(Area)`
height: auto;

`;
// overflow: hidden;  내용이 부모 요소를 넘어가지 않도록 함 

const DescriptionWrap = styled(Area)`
height: 100%;

`;
const inputStyle = {
color: 'black',
fontSize: 40,
fontFamily: 'Inter',
fontWeight: '400',
border: 'none',
outline: 'none',
width: '100%',

    '@media screen and (max-height: 864px)': {
        fontSize: 35,
    },
};

const InputSmall = styled.input`
${inputStyle}
height: 6vh;
`;

const EmptyImg = styled.img`
width: 200px;
height: 200px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);

@media screen and (max-height: 865px) {
width: 150px;
height: 150px;

};
`;
const FindImg = styled.img`
position: absolute;
bottom: 10px;
right: 10px;

width:17.5vw;
height: 7.4vh; 


@media screen and (max-height: 864px) {
  width:16.5vw;
  
};
`;


const ButtonTwo = styled.div`
`;
const UploadFinally = styled.img`
  margin-top: 20px;
  float: right;
  width: 18vw;
  height: 7.7vh;

  @media screen and (max-height: 864px) {
    width: 17.5vw;
    height: 9vh;
  }
`;

const FileBox = styled.input`
  display:none;
`;

const SelectImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  `;

  const Menu = styled.span`
  z-index: 2;
  color: white;
  font-size: 37px;
  position: absolute;
  font-weight: 500;

  @media screen and (max-height: 865px) {
    font-size: 33px;
    
    };
`;

const DropContainer = styled.div`
  z-index: 2;
  color: white;
  font-size: 23px;
  position: absolute;
  align-items: center;
`;

//드롭메뉴바
const DropMenu = styled.div` 
  position: relative;
  background-color: #798BE6;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 31px;
  z-index: 2;
  color: white;
  text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  top: -157px;


`;

const CateMenu = styled.div` 
  font-size: 29px;
  font-weight: 550;
`;

import React, { useState, useCallback,useEffect } from 'react';
import * as tf from '@tensorflow/tfjs'; //npm i @tensorflow/tfjs
import '@tensorflow/tfjs-backend-webgl'; //npm i @tensorflow/tfjs-backend-webgl

import { useNavigate } from 'react-router-dom';

import upload from '../Images/upload.png';

import Loogo from '../Component/Header' 
import styled from "styled-components";
import Success from '../Modal/Success';
const SERVER_URL= 'http://localhost:4000/api/post';

function Post() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
   
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState(''); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 URL 상태
    const [prediction, setPrediction] = useState(null);
    const [selectedClass, setSelectedClass] = useState(0); // 선택한 클래스의 인덱스
    //const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 성공 모달 보이기 
    
    /*
    // 다음 이벤트 핸들러를 추가합니다.
    const handleSuccessModalClose = () => {
      setIsSuccessModalOpen(false);
    }; */
    
    const classLabels = [
      '바디프로필',
      '반려동물',
      '가족사진',
      '증명사진',
      '웨딩사진',
      '해당없음'
    ];

    const categoryLabels  = {
        '바디프로필': 'body',
        '반려동물': 'dog',
        '가족사진': 'family',
        '증명사진': 'profile',
        '웨딩사진': 'wedding',
        '해당없음': 'none',
    };


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
    
      const [model, setModel] = useState(null);
    
    
         // 이미지 분류 함수 (소프트맥스 함수 사용)
      const classifyImage  = async (img, threshold) => {
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

      // 이미지 파일을 ImageData로 변환
      //TensorFlow.js 모델에 이미지를 입력으로 제공하기 위해서 이미지 파일을 ImageData로 변환하여 모델에 전달
      //TensorFlow.js 모델은 숫자 행렬 형태인 ImageData를 입력으로 받아들이기 때문임 
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
        // 사용자가 한글 카테고리를 선택할 때 호출되는 함수
        const handleCategorySelect = (selectedCategory) => {
          setCategory(selectedCategory);
        };

        // 서버로 전송할 때 한글 카테고리를 영어로 변환하는 함수
        const getEnglishCategory = (koreanCategory) => {
          return categoryLabels[koreanCategory];
        };
        
      const handleSubmit = () => {

          const data = {
          title,
          description,
          category:getEnglishCategory(category),
          };
          console.log(data.title);
              // 엑세스 토큰을 로컬 스토리지에서 가져오기
        const accessToken = localStorage.getItem("access_token");
      // 이미지 파일을 FormData로 감싸서 서버로 전송
          const formData = new FormData();
          formData.append('data', JSON.stringify(data));
          formData.append('image', imageFile);
          
      // fetch()를 이용하여 서버로 데이터를 전송
          fetch(SERVER_URL, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`, // 엑세스 토큰을 헤더에 추가
          },
          })
          .then((response) => response.json())
          .then((data) => {
              console.log('서버 응답:', data);
              const postId = data.data.id; // Assuming your response includes the new post's ID
              navigate(`/lookup/${postId}`); 
              //setIsSuccessModalOpen(true); // 성공 모달 열기
              handleGohomeClick();
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      };

    
    const handleMenuToggle = () => { //메뉴열기/닫기
        setIsMenuOpen(!isMenuOpen);
    };

   /*파일업로드*/
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
      // 이미지 파일이 업로드되면 예측 수행
      const classIndex = await classifyImage(imageFile, 0.8); //0.8프로의정확도가 임계값
      setSelectedClass(classIndex);
      if (classIndex === -1) {
        setPrediction(classLabels[5]);
        setCategory(classLabels[5]);
      } else {
        const predictedLabel = classLabels[classIndex];
        setPrediction(predictedLabel);
        setCategory(predictedLabel); // 카테고리를 예측된 클래스로 설정
      }
    } else {
      setImageFile(null);
      setPreviewImage(null);
    }
  };

    return (
        
        <OutWrap>
          
            <InOutWrap>            
                {/* 로고 */}        
                <Loogo/>
                {/* 내용 */} 

                <Center>                   
                    <InLayoutOne>  
                        <Content>

                            <One> {/*제목*/}
                                <WrapAuto>
                                    <InputBasic
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="제목"
                                    />
                                </WrapAuto>
                            </One>
                            
                            <Three>{/* 설명 */}
                                {/* 드래그 방지 추가하기 */}
                                <WrapPer>
                                    <TextareaBasic
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="설명" 
                                    />
                                </WrapPer>
                                
                            </Three>                                        
                            
                            <Four>{/* 이미지 */}
                                {!previewImage && (
                                    <EmptyImg src={upload} alt="upload" />
                                )} {/*빈 이미지로 사진 올리면 없어짐 */}

                                <FindImg >
                                  <Menu onClick={() => document.getElementById('fileInput').click()}>파일 찾기</Menu>
                                </FindImg>

                                <FileBox 
                                    id="fileInput"
                                    type="file"
                                    accept="image/jpg, image/png ,image/jpeg"
                                    onChange={handleImageFileChange} 
                                />

                                {previewImage && 
                                <SelectImg src={previewImage} alt="Preview" />} 
                                
                            </Four>

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
                                        {classLabels.map((label, index) => (
                                          <CateMenu key={index} onClick={() => handleCategorySelect(label)}>
                                            {label}
                                          </CateMenu>
                                        ))}    
                                    </DropMenu>
                                    )}

                                </DropContainer>

                                </ButtonOne>
                            </Left>

                            <Right> 
                                <ButtonTwo onClick={handleSubmit}>
                                    업로드  
                                </ButtonTwo>
                            </Right>
                        </Buttons>
                    </InLayoutTwo>               
                </Center>
                
            </InOutWrap>
        </OutWrap>
    );
}

export default Post;

const OutWrap = styled.div`
width: 100%;
height: 97.6vh;

position: relative;

background: white;

display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;

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
//text-align: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const Center = styled.div`
//width: 65vw;
//text-align: center;
display: flex;
flex-direction: column;
align-items: center;
`;

const InLayoutOne = styled.div`
width:65vw;

/* tablet 규격 */
        @media screen and (max-width: 1023px){
            
        }

        /* mobile 규격 */
        @media screen and (max-width: 540px){
          width: 80vw;
        }
        /* s 데스크 */
        @media screen and (min-width: 1024px){
            
        }
        /* l 데스크 */
        @media screen and (min-width: 1700px){
          width: 75vw;
        }

`;

const InLayoutTwo = styled(InLayoutOne)`
display: flex;
width:65vw;
height:12vh;
align-items: center;
margin-bottom:20px;
/* mobile 규격 */
  @media screen and (max-width: 540px){
    width: 80vw;
    height:19vh;
  }
@media screen and (min-width: 1700px) {
    width: 75vw;
    height:13vh;
};
`;

const Content = styled.div`
display: flex;
flex-direction: column;
`;

const ContentRadius = styled.div`
border: 3px #3A76EF solid;
padding: 20px;
word-wrap: break-word;
border-radius: 31px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
margin-top: 20px;

@media screen and (min-height: 900px) {
    margin-top: 30px;
    border: 4px #3A76EF solid;
};
`;

const One = styled(ContentRadius)`
display: flex;
align-items: center;
height:auto;

`;

const Two = styled(ContentRadius)`
  display: flex;
  //flex-wrap: wrap; /* 줄바꿈을 허용하여 가로 공간에 맞게 정렬될 수 있도록 설정 */
  align-items: center; /* 수직 가운데 정렬 (선택 사항) *  
`;


const Three = styled(ContentRadius)`
height: 25vh;
`;

const Four = styled(ContentRadius)`
position: relative;
overflow: hidden;
//text-align: center;
height:75vh;
`;

const Left = styled.div`
display: flex;
justify-content: center;
margin-left:auto;
`;

const Right = styled.div`
display: flex;
flex-direction: column;
margin-left: auto;

/* s 데스크 */
@media screen and (min-width: 1024px){
  margin-right:auto;
}
`;

const Radius = styled.button`
padding: 20px;
word-wrap: break-word;
border-radius: 40px;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

margin-top: 20px;
border:none;

`;
const Buttons = styled.div`
  //text-align: center;
  display: flex;
  //justify-items: space-between;
  flex-direction: row;
  width: 100%;

  /* tablet 규격 */
  @media screen and (max-width: 1023px){
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const ButtonOne = styled(Radius)`
background: #798BE6;
display: flex;
align-items: center;
justify-content: center;

cursor: pointer;
position: relative;
width: 40vw;
height: 7vh;

/* mobile 규격 */
@media screen and (max-width: 540px){
  width:80vw;
  height: 7vh; 
}
@media screen and (min-width: 1700px) {
    width: 50vw;
    height: 7.5vh;
};

`;
// 버튼투
const ButtonTwo = styled(Radius)`
  background: #798BE6;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  cursor: pointer;

  width:18vw;
  height: 7vh; 
  color: white;

  /* mobile 규격 */
  @media screen and (max-width: 540px){
    width:41vw;
    height: 7vh; 

  }

  /* s 데스크 */
  @media screen and (min-width: 1024px){
      
  }
  @media screen and (min-width: 1700px) {
    width:18vw;
    height: 7.5vh; 
  };
 `;
//파일 찾기 

const FindImg = styled(ButtonTwo)` 
  position: absolute;
  bottom: 30px;
  right: 10px;

  /* tablet 규격 */
  @media screen and (max-width: 1023px){
    bottom: 20px;
  }

`;
 // span 
const Menu = styled.span`
z-index: 2;
color: white;
position: absolute;
`;

const Area = styled.div`
display: flex;
align-items: center;
width: 100%;
overflow: hidden; 
`;

const WrapAuto = styled(Area)`
height: auto;

`;
const WrapPer = styled(Area)`
height: 100%;
`;

const inputStyle = {
color: 'black',
fontFamily: 'Inter',
border: 'none',
outline: 'none',
width: '100%'
};

const InputBasic = styled.input`
${inputStyle}
height: 6vh;
`;

const TextareaBasic = styled.textarea`
${inputStyle}
height: 100%;
`;

const EmptyImg = styled.img`
width: 200px;
height: 200px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
/* tablet 규격 */
  @media screen and (max-width: 1023px){
      
  }

  /* mobile 규격 */
  @media screen and (max-width: 540px){
    width: 120px;
    height: 120px;
  }
  /* s 데스크 */
  @media screen and (min-width: 1024px){
    
  }
  /* l 데스크 */
  @media screen and (min-width: 1700px){
      
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

const DropContainer = styled.div`
  z-index: 2;
  color: white;
  //font-size: 33px;
  position: absolute;
  align-items: center;
`;

//드롭메뉴바
const DropMenu = styled.div` 
  position: relative;
  background-color: #798BE6;
  //border: 1px solid #ccc;
  padding: 10px;
  border-radius: 31px;
  z-index: 2;

  //text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  top: -137px;


  /* tablet 규격 */
        @media screen and (max-width: 1023px){
            
        }

        /* mobile 규격 */
        @media screen and (max-width: 540px){
          width:45vw;
          top: -147px;
        }
        /* s 데스크 */
        @media screen and (min-width: 1024px){
          width:25vw;
        }
        /* l 데스크 */
        @media screen and (min-width: 1700px){
          width:40vw;
          top: -177px;
        }
`;

const CateMenu = styled.div` 
  font-size: 25px;
  margin-top:5px;

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
          font-size: 30px;
        }
`;


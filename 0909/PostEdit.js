import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs'; //npm i @tensorflow/tfjs
import '@tensorflow/tfjs-backend-webgl'; //npm i @tensorflow/tfjs-backend-webgl
import { useNavigate } from 'react-router-dom';
import upload from '../Images/upload.png';
import  * as S from './PostStyle'
import Loogo from '../Component/Header' 
import styled from "styled-components";
import Loading from '../Component/Loading';
const SERVER_URL= 'http://localhost:4000/api/postedit';

function PostEdit() {
    const [post, setPost] = useState({});
    const [updatedPost, setUpdatedPost] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [profile, setProfile] = useState(''); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 URL 상태
    const [prediction, setPrediction] = useState(null);
    const [selectedClass, setSelectedClass] = useState(0); // 선택한 클래스의 인덱스
    const [model, setModel] = useState(null);
    const [getloading, setGetLoading] = useState(false);

    const classLabels = [
      '바디프로필',
      '반려동물',
      '가족사진',
      '증명사진',
      '웨딩사진',
      '해당없음'
    ];

    
    const categoryLabels = {
      'body': '바디프로필',
      'dog': '반려동물',
      'family': '가족사진',
      'profile': '증명사진',
      'wedding': '웨딩사진',
      'none': '해당없음'
    };

    const categoryLabel  = {
      '바디프로필': 'body',
      '반려동물': 'dog',
      '가족사진': 'family',
      '증명사진': 'profile',
      '웨딩사진': 'wedding',
  };

    const navigate = useNavigate();
  
    //홈페이지
    const handleGohomeClick = () => {
        navigate('/home');
    };

    //데이터 가져오기 위해 
    const params = useParams(); // 
    const id = params.id; // 게시글 몇번인지 

    useEffect(() => {
    const getBoard = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/${id}`);
        if (response.ok) {
          const postData = await response.json();
          console.log('Fetched data:', postData);
           // 서버에서 받은 category 값을 한글로 변환하여 설정
          const koreanCategory = categoryLabels[postData.category];
          setCategory(koreanCategory);
          setPost(postData);
          setUpdatedPost(postData);
          console.log('Updated post data:', postData);
        } else {
          console.error('Failed to fetch data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    getBoard();
    //console.log(updatedPost.title);
  }, [id]);
    
    useEffect(() => {
      // 모델 로드
      const modelUrl = '../model_tfjs/model.json';
      async function loadModel() {
          const loadmodel = await tf.loadLayersModel(modelUrl);
          setModel(loadmodel);
          }
          loadModel();
      }, []);

    
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

    
    //text들
    const handleChange = (event, index, field)  => {
      const { value } = event.target;
      console.log(`handleChange - index: ${index}, field: ${field}, value: ${value}`);
      setUpdatedPost((prevPosts) =>
        prevPosts.map((post, i) =>
          i === index ? { ...post, [field]: value } : post
        )
      );
      console.log('Updated Post Array:', updatedPost);

    };


    /*파일업로드*/
const handleImageFileChange = async (event, index) => {
  //console.log(`handleImageFileChange - index: ${index}`);
  //이미지 파일 유효성 검사
  const imageFile = event.target.files[0];
  //console.log('Selected image file:', imageFile);
  if (
    imageFile &&
    (imageFile.type === 'image/jpeg' ||
      imageFile.type === 'image/png' ||
      imageFile.type === 'image/jpg') &&
    imageFile.size <= 30 * 1024 * 1024
  ) {
    // 이전에 생성된 URL 해제
    if (updatedPost[index].imagePreviewUrl) {
      URL.revokeObjectURL(updatedPost[index].imagePreviewUrl);
    }

    // 이미지 파일 업로드 및 미리보기 생성
    const imageUrl = URL.createObjectURL(imageFile);
    console.log('New image URL:', imageUrl); // imageUrl 값 확인
    setPreviewImage(imageUrl);

    // 이미지 예측 및 카테고리 설정
    const classIndex = await classifyImage(imageFile, 0.8); //0.8프로의정확도가 임계값
    setSelectedClass(classIndex); //인덱스를 기반으로 카테고리를 설정

    let categoryToSet; //이미지 파일 업로드 및 분류 후 설정할 카테고리를 저장하는 변수
    
    if (classIndex === -1) {
      categoryToSet = classLabels[5];
    } else {
      categoryToSet = classLabels[classIndex];
    }

    // 이미지의 카테고리를 화면에 띄우기 위해 해당 post 객체의 카테고리 정보를 업데이트
    // 저장했던 이미지의 카테고리를 가져와 화면에 표시하는 역할
    setUpdatedPost((prevPosts) => // 이전에 저장한 이미지의 post 객체를 업데이트
      prevPosts.map((post, i) =>
        i === index ? { 
          ...post, 
          imagePreviewUrl: imageUrl, 
         newImageFile: imageFile, 
          category: categoryToSet  
        } : post
      )
    );
   
    // 카테고리 정보 설정
    setCategory(categoryToSet);
    console.log('Updated image:', imageFile);
  } else {
    //선택한 파일이 이미지 파일이 아니거나 크기가 유효하지 않을 경우, 이미지 관련 상태를 초기화
    setImageFile(null);
    setPreviewImage(null);
  }
};

const handleCategorySelect = (selectedCategory, index) => {
  console.log(`handleCategorySelect - index: ${index}, selectedCategory: ${selectedCategory}`);
  setUpdatedPost((prevPosts) =>
      prevPosts.map((post, i) =>
          i === index ? { ...post, category: selectedCategory } : post
      )
  );
  console.log('Updated Post Array:', updatedPost);
};


 // 수정 업로드 버튼
const handleUpdate = (index) => {
  if (updatedPost[index] && updatedPost[index].newImageFile) {
    const updatedData = updatedPost[index];
    console.log('updatedData:', updatedData);

    // 이미지 파일을 FormData로 감싸서 서버로 전송
    const formData = new FormData();

    // 서버로 보낼 때는 영어 category 값을 사용
    const englishCategory = categoryLabel[updatedData.category] || updatedData.category;
    formData.append('data', JSON.stringify({ ...updatedData, category: englishCategory }));
    formData.append('newImageFile', updatedData.newImageFile);

      //console.log('전송할 데이터:', formData);

      for (const entry of formData.entries()) {
        const [key, value] = entry;
        console.log(`Key: ${key}`, value);
      }
      
      // 서버로 업데이트된 데이터와 이미지 함께 보내는 로직 추가
      fetch(`${SERVER_URL}/${id}`, {
        method: 'PUT',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('서버 응답:', data);
        //handleGohomeClick();

        // 서버에서 받은 이미지 URL을 업데이트된 데이터에 반영
        const updatedDataWithImageUrl = {
        ...updatedData,
        image_url: updatedData.image_url,
        imagePreviewUrl: updatedData.image_url,
      };

      // 화면을 업데이트
      const updatedPosts = [...updatedPost];
      updatedPosts[index] = updatedDataWithImageUrl;
      setUpdatedPost(updatedPosts);
      console.log(updatedPosts);

      handleGohomeClick();
      console.log('전송할 데이터:', updatedData.newImageFile);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      console.log("No new image file to upload.");
    }
  };
  

    // 취소 버튼 
    const handleCancel =() => {
        navigate(`/lookup/${id}`);
    }

    const handleMenuToggle = () => { //메뉴열기/닫기
        setIsMenuOpen(!isMenuOpen);
    };


    return (
        <>
        {getloading ? (
            // 로딩 중일 때
            <Loading what="Loading" />
        ) : (
            //로딩 끝나면 
            <S.OutWrap>
              <S.InOutWrap>            
                  {/* 로고 */}        
                  <Loogo/>
                  {/* 내용 */} 
                  <S.Center>
                    <S.InLayoutOne>
                      <S.Content>
                          {updatedPost && updatedPost.map((post, index) => {
                            const imageUrl = post.image_url;
                  
                            return (
                                <div key={index}>
                                  <S.One>
                                    <S.WrapAuto>
                                        <S.InputBasic
                                            type="text"
                                            name="title"
                                            value={post.title}
                                            onChange={e => handleChange(e, index, "title")}
                                        />
                                    </S.WrapAuto>
                                  </S.One>


                                  <S.Three>
                                    <S.WrapPer>
                                      <S.TextareaBasic
                                        value={post.description}
                                        onChange={e =>
                                          handleChange(e, index, "description")
                                        }
                                        placeholder="설명"
                                      />
                                    </S.WrapPer>
                                  </S.Three>

                                  <S.Four>
                                    <S.SelectImg src={post.imagePreviewUrl || imageUrl} alt={`게시글 이미지`} />
                                    <S.FindImg >
                                      <S.Menu onClick={() => document.getElementById('fileInput').click()}>파일 찾기</S.Menu>
                                    </S.FindImg>

                                    <S.FileBox 
                                        id="fileInput"
                                        type="file"
                                        accept="image/jpg, image/png ,image/jpeg"
                                        onChange={(e) => handleImageFileChange(e, index, 'image_url')}
                                    />

                                    {previewImage && 
                                    <S.SelectImg src={previewImage} alt="Preview" />}      
                                  </S.Four>

                                </div>
                            );
                          })}
                      </S.Content>
                    </S.InLayoutOne>

                    <S.InLayoutTwo>
                        <S.Buttons>
                          {updatedPost.map((post, index) => (
                              <S.Left key={index}>
                              <S.ButtonOne onClick={handleMenuToggle}>
                                  {post.category ? (
                                        <S.Menu>{categoryLabels[post.category] || post.category}</S.Menu>
                                  ) : (
                                      <S.Menu>카테고리 선택</S.Menu>
                                  )}
                                  <S.DropContainer>

                                    {isMenuOpen && (
                                     <S.DropMenu > {/* 스타일 수정 */}
                                      
                                        <S.CateMenu onClick={() => handleCategorySelect(classLabels[0], index)}>{classLabels[0]}</S.CateMenu>
                                        <S.CateMenu onClick={() => handleCategorySelect(classLabels[1], index)}>{classLabels[1]}</S.CateMenu>
                                        <S.CateMenu onClick={() => handleCategorySelect(classLabels[2], index)}>{classLabels[2]}</S.CateMenu>
                                        <S.CateMenu onClick={() => handleCategorySelect(classLabels[3], index)}>{classLabels[3]}</S.CateMenu>
                                        <S.CateMenu onClick={() => handleCategorySelect(classLabels[4], index)}>{classLabels[4]}</S.CateMenu>
                                        <S.CateMenu onClick={() => handleCategorySelect(classLabels[5], index)}>{classLabels[5]}</S.CateMenu>
                                    </S.DropMenu>
                                    )}

                                </S.DropContainer>
                            </S.ButtonOne>
                        </S.Left>
                      ))}

                        <S.Right>
                        {updatedPost.map((post, index) => (
                            <div key={post.id}>
                              {/* 게시물 내용 렌더링 */}
                              <S.EditButton onClick={() => handleUpdate(index)}>업로드</S.EditButton>
  </div>
))}
                          <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
                        </S.Right>
                      </S.Buttons>
                  </S.InLayoutTwo>
                </S.Center>

              </S.InOutWrap>
            </S.OutWrap>
            
            )}
        </>
    );
}

export default PostEdit;

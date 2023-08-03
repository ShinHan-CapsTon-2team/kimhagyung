
//import React, { useState ,useRef, useCallback} from 'react';
import React, { useState ,useRef, useCallback, useEffect } from 'react';
import logo from '../Images/imagelogo.png';
import * as tf from '@tensorflow/tfjs';
import upload from '../Images/upload.png';
import f_file from '../Images/f-file.png';
import c_upload from '../Images/com_upload.png';
//import './cnn-model.js';
//import hol from '../Images/place.png';


const SERVER_URL= 'http://localhost:4000/api/post';

function Post() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [profile, setProfile] = useState(''); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 URL 상태
  const [predictedCategory, setPredictedCategory] = useState(''); // 분류 결과를 저장하는 상태
 // 모델 상태를 저장하는 상태 추가
 const [model, setModel] = useState(null);

// 컴포넌트가 마운트된 후에 모델을 로드
useEffect(() => {
  // 모델 파일 경로
  const modelFilePath = '../model/model--0005-0.3897.hdf5';

  // 모델 파일을 로드하는 함수 정의
  const loadModel = async () => {
    try {
      const model = await tf.loadLayersModel(modelFilePath);
      setModel(model);
    } catch (error) {
      console.error('Error while loading the model:', error);
    }
  };

  // 모델 로드 함수 호출
  loadModel();
}, []);

  const handleSubmit = () => {
    //window.location.href = '/home';
    // 사용자가 게시글을 업로드한 시점의 시간
    //const currentTime = new Date().toISOString();
    // 서버로 보낼 데이터 객체를 생성
    const data = {
      title,
      description,
      category,
      name,
      profile,
    };

// 이미지 파일을 FormData로 감싸서 서버로 전송
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('image', imageFile);
    
// fetch()를 이용하여 서버로 데이터를 전송
    fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('서버 응답:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

// 이미지를 Tensor로 변환하고 분류하는 함수
const classifyImage = async (img) => {
  try {
    if (!model) {
      console.error('Model is not loaded.');
      return;
    }

    const imgTensor = tf.browser.fromPixels(img);
    const imgTensorExpanded = imgTensor.expandDims();
    const predictions = model.predict(imgTensorExpanded);
    const categoryIndex = getPredictedCategory(predictions);
    setPredictedCategory(categoryIndex);
    imgTensor.dispose();
    imgTensorExpanded.dispose();
    tf.dispose(predictions);
  } catch (error) {
    console.error('Error while classifying image:', error);
  }
};

// 이미지 로드 완료 후 이미지 분류 실행
const handleImageLoad = (e) => {
  const img = e.target;
  classifyImage(img);
};


  const handleMenuToggle = () => { //메뉴열기/닫기
    setIsMenuOpen(!isMenuOpen);
  };


  /*카테고리*/
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  /*로고클릭->홈페이지*/
  const handleLogoClick = () => {
    window.location.href = '/home';
  };

  /*파일업로드*/
  const handleImageFileChange = (e) => {
    const imageFile = e.target.files[0];
    if (
      imageFile &&
      (imageFile.type === 'image/jpeg' ||
        imageFile.type === 'image/png' ||
        imageFile.type === 'image/jpg') &&
      imageFile.size <= 30 * 1024 * 1024
    ) {
      setImageFile(imageFile);
      setPreviewImage(URL.createObjectURL(imageFile));
    } else {
      setImageFile(null);
      setPreviewImage(null);
    }
  };

/*
// TensorFlow.js 모델 로드 및 분류 함수 정의
const classifyImage = async (imageFile) => {
  try {
    // 모델 파일을 로드하기 위해 fetch 함수를 사용하여 ArrayBuffer로 변환
    const modelFileResponse = await fetch('../model/model--0005-0.3897.hdf5');
    const modelFileBuffer = await modelFileResponse.arrayBuffer();
    const model = await tf.loadLayersModel(tf.io.browserFiles([modelFileBuffer])); // 파일을 배열로 감싸서 전달

    // 이미지를 Tensor로 변환
    const img = await tf.browser.fromPixels(imageFile);
    const imgTensor = img.expandDims();

    // 이미지 분류
    const predictions = model.predict(imgTensor);

    // 분류 결과를 처리
    const categoryIndex = getPredictedCategory(predictions);
    setCategory(categoryIndex);

    // 메모리 해제
    img.dispose();
    imgTensor.dispose();
    tf.dispose(predictions);

  } catch (error) {
    console.error('Error while classifying image:', error);
  }
};
*/

// 분류 결과를 처리하는 함수 (예시로 가장 확률이 높은 클래스의 인덱스 반환)
const getPredictedCategory = (predictions) => {
  // 분류 결과에서 가장 높은 확률을 가진 클래스의 인덱스를 반환하는 작업을 수행합니다.
  // 예시: argMax를 사용하여 가장 높은 확률의 클래스 인덱스를 반환합니다.
  const categoryIndex = predictions.argMax().dataSync()[0];
  return categoryIndex;
};



  const textRef = useRef();

  const handleResizeHeight = useCallback(() => {
    const maxHeight = 650;
    const calculatedHeight = textRef.current.scrollHeight;
    const newHeight = calculatedHeight <= maxHeight ? calculatedHeight : maxHeight;
    textRef.current.style.height = newHeight + 'px';
  }, []);


  return (

    <div style={{width: '100%', height: '100%', position: 'relative', background: 'white',boxSizing: 'border-box' }}>
        
      <div style={{ width: 496, height: 239,textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img style={{width: 354, height: 239, left: 0, top: 0, position: 'absolute'}} src={logo} alt=''  onClick={handleLogoClick}/>
      </div>


      <div style={{ display: 'flex',marginLeft:20,marginRight:20,flexWrap: 'wrap',height:500}}>
          <div style={{ width:1272 }}>

              <div style={{ height: 'auto', opacity: 0.90, background: 'white', borderRadius: 31, border: '3px #3A76EF solid', padding: '20px', wordWrap: 'break-word'}}> 
              {/*input 박스 수정해야함 */}
                  <div style={{  borderRadius: 31,paddingLeft: '20px', paddingRight: '20px' }}>
                    <input style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400',border: 'none',outline:'none',width:'100%' }}
                        type="text"
                        className="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목"
                      />
                  </div>
              </div>

              <div style={{ height: 'auto', opacity: 0.90, background: 'white', borderRadius: 31, border: '3px #3A76EF solid', marginTop: 20, marginBottom: 20, padding: '20px', wordWrap: 'break-word' }}>
                  {/* 추가된 부분 시작 */}
                  <div style={{  borderRadius: 31 , paddingLeft: '20px', paddingRight: '20px'}}>
                      <textarea style={{ color: 'black',width:'100%', fontSize: 40, fontFamily: 'Inter', fontWeight: '400',border: 'none',outline:'none'  }}
                          value={description}
                          className="description"
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="설명"
                      />
                  </div>
                  {/* 추가된 부분 끝 */}
              </div>

{/* 
              <div style={{ position:'relative', height:500 , opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid',padding: '20px' }}> */}
              <div style={{ position: 'relative', opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid', padding: '20px', height: previewImage ? 'auto' : 500 }}>
                {!previewImage && (
                  <img className="upload-img" style={{ width: 100, height: 100, objectFit: 'cover',position:'absolute',top:'50%',left:'50%',transform: 'translate(-50%,-50%)'}} src={upload} alt="upload" />
                )}

                <img style={{ position: 'absolute', bottom: '10px', right: '10px',}}className="f-file" src={f_file} alt="f_file" onClick={() => document.getElementById('fileInput').click()}/>
                <input //이미지를 사용자로부터 받아온다 
                  id="fileInput"
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/jpg, image/png ,image/jpeg"
                  onChange={handleImageFileChange}
                />
                {previewImage && <img style={{width:'100%',height:'100%',objectFit: 'cover'}} className="selected-image" src={previewImage} alt="Preview" />}

                  
                  
              </div>

              <div style={{ width:700,height: 50, opacity: 0.90, background: '#798BE6', borderRadius: 31,marginTop:20, padding: '20px', wordWrap: 'break-word', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', position: 'relative',justifyContent: 'center',left:'50%',transform: 'translate(-50%)' }} onClick={handleMenuToggle}>
                
                {category ? (
                  <span className="category-text" style={{ zIndex: 2, color: 'white', fontSize: '33px', position: 'absolute' }}>{category}</span>
                ) : (
                  <span className="category-text" style={{ zIndex: 2, color: 'white', fontSize: '33px', position: 'absolute' }}>카테고리 선택</span>
                )}
                <div style={{ zIndex: 2, color: 'white', fontSize: '23px',position: 'absolute', }} className="dropdown-menu-container">
                
                  {isMenuOpen && (
                    <div style={{ zIndex: 2, color: 'black', fontSize: '23px' }} className="dropdown-menu">
                      <div onClick={() => handleCategorySelect('가족사진')}>가족사진</div>
                      <div onClick={() => handleCategorySelect('증명사진')}>증명사진</div>
                      <div onClick={() => handleCategorySelect('반려동물')}>반려동물</div>
                      <div onClick={() => handleCategorySelect('바디프로필')}>바디프로필</div>
                      <div onClick={() => handleCategorySelect('웨딩사진')}>웨딩사진</div>   
                    </div>

                  )}
                </div>
              </div>

   {predictedCategory !== '' && (
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: 20 }}>
          분류 결과: {predictedCategory}
        </div>
      )}
              
          </div> 

          <div style={{ marginLeft: 20 }}>
              <div style={{ width: 491, height: 'auto', opacity: 0.90, background: 'white', borderRadius: 31, border: '3px #3A76EF solid', padding: '20px', wordWrap: 'break-word' }}>
                  <div style={{  borderRadius: 31 }}>
                    <input style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', paddingLeft: '20px', paddingRight: '20px',border: 'none',outline:'none'  }}
                          type="text"
                          className="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="이름"
                      />
                  </div>
              </div>

              <div style={{ width: 491, height: 670, opacity: 0.90, background: 'white', padding: '20px', wordWrap: 'break-word', borderRadius: 31, border: '3px #3A76EF solid', marginTop: 20 }}>
                  <div style={{  borderRadius: 31 , paddingLeft: '20px', paddingRight: '20px'}}>
                    <textarea style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400',border: 'none',outline:'none' ,height:'auto', }}
                      className="profile"
                      ref={textRef}
                      onInput={handleResizeHeight}
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      placeholder="소개 및 커리어"
                    />
                  </div>
              </div>

              <div>
                <img  style={{ marginTop: 20 ,float:'right' }}
                className="c-upload"
                src={c_upload}
                alt=""
                onClick={handleSubmit}
                  />
              </div>
          </div>   
      </div>

      

           
    </div>
  );
}

export default Post;
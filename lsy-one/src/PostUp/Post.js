
import React, { useState } from 'react';
import logo from '../Images/imagelogo.png';

import upload from '../Images/upload.png';
import f_file from '../Images/f-file.png';
import c_upload from '../Images/com_upload.png';
import set_Cate from '../Images/sel-Cate.png';
// import hol from '../Images/place.png';
import './Post.css';

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


  // 사용자가 게시글을 업로드한 시점의 시간을 가져오는 함수
  const getCurrentTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

  const handleSubmit = () => {
    //window.location.href = '/home';
    // 사용자가 게시글을 업로드한 시점의 시간
    //const currentTime = new Date().toISOString();
    // 서버로 보낼 데이터 객체를 생성
    const data = {
      title,
      description,
      //image_url: previewImage, //미리보기 이미지를 전송
      category,
      name,
      profile,
      //created_at : getCurrentTime(),
    };

// 이미지 파일을 FormData로 감싸서 서버로 전송
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('image', imageFile);
    
// fetch()를 이용하여 서버로 데이터를 전송
    fetch(SERVER_URL, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json', 
      // },
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
  //   fetch(SERVER_URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // 서버의 응답 처리
  //       console.log('서버 응답:', data);
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };




  // const handleImageClick = (image) => {
  //   setSelectedImage(image);
  // };

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
  // const handleImageFileChange = (e) => {
  //   const image_url = e.target.files[0];
  //   // 파일 유형 및 크기 체크
  //   if (image_url && (image_url.type === 'image/jpeg' || image_url.type === 'image/png'||image_url.type === 'image/jpg') && image_url.size <= 30 * 1024 * 1024) {
  //     setImageFile(image_url);
  //     setPreviewImage(URL.createObjectURL(image_url)); // 파일 미리보기 이미지 설정
  //   } else {
  //     setImageFile(null);
  //     setPreviewImage(null); // 파일이 유효하지 않을 때 미리보기 이미지 초기화
  //   }
  // };


  return (

    
    <div className="container">
      {/* 업로드박스 */}
      <div className="box1" />

      <img className="logo" src={logo} alt="logo" onClick={handleLogoClick}/>
      
      <input
        type="text"
        className="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
      />

      <textarea
        className="profile"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
        placeholder="소개 및 커리어"
      />

      <textarea
        value={description}
        className="description"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명"
      />

      <input
        type="text"
        className="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />

      <img className="upload-img" src={upload} alt="upload" />

      <img
        className="c-upload"
        src={c_upload}
        alt=""
        onClick={handleSubmit}
      />

    {category && <div className="selected-category">{category}</div>} {/* 카테고리 표시 부분 */}
    
    {!category && <span className="category-text">카테고리 선택</span>} {/* 카테고리 선택 안내 텍스트 */}
    
      <img className="set-cate" src={set_Cate} alt="set_Cate" onClick={handleMenuToggle}/>
      <div className="dropdown-menu-container">
        {isMenuOpen && (
          <div className="dropdown-menu">
          <div onClick={() => handleCategorySelect('가족사진')}>가족사진</div>
          <div onClick={() => handleCategorySelect('증명사진')}>증명사진</div>
          <div onClick={() => handleCategorySelect('반려동물')}>반려동물</div>
          <div onClick={() => handleCategorySelect('바디프로필')}>바디프로필</div>
          <div onClick={() => handleCategorySelect('웨딩사진')}>웨딩사진</div>   
        </div>

        )}
        
      </div>
      {/* <img className="placeholder" src={hol} alt="placeholder" />  */}
      
      {previewImage && <img className="selected-image" src={previewImage} alt="Preview" />}

      <img className="f-file" src={f_file} alt="f_file" onClick={() => document.getElementById('fileInput').click()}/>
      <input //이미지를 사용자로부터 받아온다 
        id="fileInput"
        type="file"
        style={{ display: 'none' }}
        accept="image/jpg, image/png ,image/jpeg"
        onChange={handleImageFileChange}
      />
      {/* {imageFile && (
        <button className="upload-button" onClick={handleImageUpload}>
          업로드
        </button>
      )} */}

      {/* {image_url && <div className="selected-image">{image_url}</div>}
       */}

    </div>
  );
}

export default Post;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../Images/imagelogo.png';

import file from '../Images/image_6.png';
import result from '../Images/image_5.png';
import upload from '../Images/upload.png';

import styled from "styled-components";


function Recommend() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 500;
        const maxHeight = 800;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageSrc = canvas.toDataURL('image/jpeg');

        setSelectedFile(file);
        setImageSrc(resizedImageSrc);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };


  //홈페이지
  const handleGohomeClick = () => {
    navigate('/home');
  };
  const handleImageUploadAndNavigate = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://example.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 이미지 업로드 성공
        console.log('Image upload success!');
        
        // 업로드가 완료된 후 다른 페이지로 이동
        navigate('/other-page');
      } else {
        // 이미지 업로드 실패
        console.error('Image upload failed:', response.status);
      }
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  //const OutWrap = styled.div``;
  //const OutWrap = styled.div``;

  return (
    <OutWrap>
      <LogoWrap>
        <Logo src={logo} alt='' onClick={handleGohomeClick}/>
      </LogoWrap>

      <InnerWrap>
        <Box> 
            {selectedFile && (
                <SelectImg src={imageSrc} alt="upload" />
                )}{/* 업르드시 보이는 사진 */}
        
            {!selectedFile && (
                <EmptyImg src={upload} alt="up" />        
            )}{/* 빈 이미지 로고 그림인데 업로드 하면 없어진 */}


            {!selectedFile && (
                <FindImg src={file} alt="file" onClick={() => document.getElementById('file-upload').click()} />
            )}

            <InputBox
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
            />
            {/* 위 아래  파일찾기  버튼, 이미지 셀렉 하면 없어진다. */}
        </Box>
        <Button>
          <Link to="/quizresult">
              <GoResult src={result} alt="result" onClick={handleImageUploadAndNavigate} />
          </Link>
        </Button>
      </InnerWrap>

      
    </OutWrap>
  );
}

export default Recommend;

const OutWrap = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoWrap = styled.div`
  width: 496px;
  height: 239px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-height: 864px) {
    width: 456px; height: 199px; 
  };
`;

const InnerWrap = styled.div`
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

  const Logo = styled.img`
  width: 354px; height: 239px; 

  @media screen and (max-height: 864px) {
    width: 314px; height: 199px; 
  }`;

  const Box = styled.div`
  width: 65vw;
  position: relative;
  height: 60vh;
  text-align: center;
  opacity: 0.90;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 31px;
  border: 3px #3A76EF solid;
  padding: 20px;
  overflow: hidden;

  @media screen and (max-height: 864px) {
    height: 55vh; 
  };
`;

  const SelectImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
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

  width:18vw;
  height: 8vh; 
  

  @media screen and (max-height: 864px) {
    width:17vw;
    height: 7.5vh; 
  };

`;
const GoResult = styled.img`
  width:18.5vw;
  height: 7.5vh;

  @media screen and (max-height: 864px) {
    width:18vw;
    height: 7vh; 
  };
  `;
  const InputBox = styled.input`
  display: none;
`;

const Button = styled.div`
  width: 67vw;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

  
  
  
import React, { useState, useEffect } from 'react';
import fs from 'fs'; //npm i fs

function ImageGallery(){
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    // 폴더 내의 모든 파일을 읽어옴
    const folderPath = './cosine-img/dog';
    const files = fs.readdirSync(folderPath);

    // 이미지 파일만 걸러서 배열에 저장
    const imageFiles = files.filter(file => {
      const lowerCaseFile = file.toLowerCase();
      return lowerCaseFile.endsWith('.jpg') || lowerCaseFile.endsWith('.png') || lowerCaseFile.endsWith('.jpeg');
    });

    // 이미지 파일의 경로를 배열로 저장
    const imagePaths = imageFiles.map(file => `${folderPath}/${file}`);
    setImagePaths(imagePaths);
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div>
        {imagePaths.map((imagePath, index) => (
          <img key={index} src={imagePath} alt={`Image ${index}`} style={{ maxWidth: '300px', margin: '10px' }} />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

import React, { useState, useEffect } from 'react';

function ImageGallery() {
  const [imagePaths, setImagePaths] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 서버에서 이미지 파일 경로를 가져옴
    fetch('http://localhost:4000/api/files')
      .then(response => response.json())
      .then(data => {
        setImagePaths(data.map(imagePath => `http://localhost:4000${imagePath}`)); // 이미지 경로에 서버 주소 추가하여 설정
        console.log('Received image paths:', data); // 이미지 파일 경로들을 로그로 출력
      })
      .catch(error => {
        console.error('Error fetching image paths:', error);
        setError(error);
      });
  }, []);
  

  return (
    <div>
      <h1>Image Gallery</h1>
      <div>
        {imagePaths.map((imagePath, index) => (
          <img
            key={index}
            //src={`http://localhost:4000${imagePath}`} // 이미지 경로에 서버 주소 추가
            src={imagePath}
            alt={`Image ${index}`}
            style={{ maxWidth: '200px', margin: '10px' }}
            onError={() => console.error(`Error loading image ${index} from ${imagePath}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;

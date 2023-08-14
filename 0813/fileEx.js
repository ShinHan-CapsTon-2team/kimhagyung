import React, { useState, useEffect } from 'react';

function ImageGallery({ subfolder }) {
  const [imagePaths, setImagePaths] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/${subfolder}`)
      .then(response => response.json())
      .then(data => {
        setImagePaths(data.map(imagePath => `http://localhost:4000${imagePath}`));
        console.log('Received image paths:', data);
      })
      .catch(error => {
        console.error('Error fetching image paths:', error);
        setError(error);
      });
  }, [subfolder]);

  const handleButtonClick = (folder) => {
    fetch(`http://localhost:4000/api/${folder}`)
      .then(response => response.json())
      .then(data => {
        setImagePaths(data.map(imagePath => `http://localhost:4000${imagePath}`));
        console.log('Received image paths:', data);
      })
      .catch(error => {
        console.error('Error fetching image paths:', error);
        setError(error);
      });
  };

  return (
    <div>
      <h1>Select a Folder</h1>
      <div>
        <button onClick={() => handleButtonClick('family')}>Family</button>
        <button onClick={() => handleButtonClick('dog')}>Dog</button>
        <button onClick={() => handleButtonClick('wedding')}>Wedding</button>
      </div>
      <h1>Images in {subfolder}</h1>
      <div>
        {imagePaths.map((imagePath, index) => (
          <img key={index} src={imagePath} alt={`Image ${index}`} style={{ width: '200px', height: 'auto' }} />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;

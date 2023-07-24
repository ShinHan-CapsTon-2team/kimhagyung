//기본 제공 fetch
//axios 라이브러리 



import React from 'react';
import imagelogo from './Images/imagelogo.png';

function App() {
    

    const handleImageClick = () => {
        window.location.href = '/';
    };

    return (
        <div>
        {/* imagelogo를 이미지 태그로 감싸고 onClick 이벤트 리스너 추가 */}
            <img className="logo" src={imagelogo} alt="" onClick={handleImageClick} />
        </div>
    );
}

export default App;

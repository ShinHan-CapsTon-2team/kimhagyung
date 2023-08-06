import { useLocation } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import pic1 from '../Images/image 7.png'
import pic2 from    '../Images/image 8.png'

const Quizresult  = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('name');
    const res = params.get('res');

    const navigate = useNavigate();

    // 홈페이지 이동 수정 
    const handleGoHomeClick = () => {
        navigate('/home');
    };

    // 업로드 이동 수정 
    const handleGoUploadClick = () => {
        navigate('/post');
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 50 }}>
                <img style={{ width: 398, height: 492, opacity: 0.90, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '4px #3A76EF solid' }} src="https://via.placeholder.com/378x482" />
                <img style={{ width: 398, height: 492, opacity: 0.90, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '4px #3A76EF solid' ,marginLeft:20,marginRight:20}} src="https://via.placeholder.com/378x482" />
                <img style={{ width: 398, height: 492, opacity: 0.90, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '4px #3A76EF solid' }} src="https://via.placeholder.com/378x482" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <img style={{ width: 347.14, height: 82 ,padding:25}} src={pic1} onClick={handleGoHomeClick} />
                <img style={{ width: 370, height: 82 ,padding:25}} src={pic2} onClick={handleGoUploadClick}/>
            </div>
        </div>
    );
};

export default Quizresult;

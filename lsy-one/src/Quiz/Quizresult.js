import { useLocation } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import pic1 from '../Images/image 7.png'
import pic2 from    '../Images/image 8.png'
import styled from "styled-components";

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
        navigate('/photoup');
    };

    const OutWrap = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

    const InsideWrap = styled.div`
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 50px; 
    `;

    const OneImg = styled.img`
        width: 398px;
        height: 492px;
        opacity: 0.90;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 31px;
        border: 4px #3A76EF solid;
        margin-left: ${({ isMargin }) => (isMargin ? '20px' : 0)};
        margin-right: ${({ isMargin }) => (isMargin ? '20px' : 0)};
    `;

    const InsideNextWrap = styled.div`
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `;

    const TwoImgone = styled.img`
        width: 347.14px;
        height: 82px;
        padding: 25px;
    `;

    const TwoImgtwo = styled.img`
        width: 370px;
        height: 82px;
        padding: 25px;
    `;
    
    //const Margin = styled.img`
      //  margin-lef:20px;
        //margin-right:20px;
    //`;


    return (
        <OutWrap>
            <InsideWrap>
                <OneImg src="https://via.placeholder.com/378x482" />
                <OneImg src="https://via.placeholder.com/378x482" isMargin />
                <OneImg src="https://via.placeholder.com/378x482" />
            </InsideWrap>
            <InsideNextWrap>
                <TwoImgone src={pic1} onClick={handleGoHomeClick} />
                <TwoImgtwo src={pic2} onClick={handleGoUploadClick}/>
            </InsideNextWrap>
        </OutWrap>
    );
};

export default Quizresult;

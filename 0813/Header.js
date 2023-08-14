
import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';

import logo from '../Images/imagelogo.png';
import styled from "styled-components";
import homelogo from '../Images/homelogo.png'

const Header=() => 
{
    const navigate = useNavigate();
     // page

    // landing page
    const handleGoLandingClick = () => {
        navigate('/');
        };
    
    //홈페이지
    const handleGohomeClick = () => {
        navigate('/home');
    };
    return (

    <LogoWrap>                
        <LandingWrap> 
            <Logo src={logo} alt='' onClick={handleGoLandingClick}/>
        </LandingWrap> 
        
        <HomeWrap >
            <HomeLogo src={homelogo} alt='homelogo' onClick={handleGohomeClick} />
        </HomeWrap>         
    </LogoWrap>

    );
};

export default Header;

const LogoWrap = styled.div`

width: 100%; 
height: 23.2vh;
// text-align: center;
display: flex;
//flex-direction: row;
align-items: center;
justify-content: space-between;

//position: relative;

@media screen and (min-height: 900px) {
//width: 29vw; 
height: 26.2vh;
};
`;
const LandingWrap = styled.div`
`;
const HomeWrap = styled.div`
margin-right:25px;
`;

const HomeLogo =styled.img`
width:90px;
height:90px;
`;

const Logo = styled.img`
width: 27vw; 
height: 23vh;

position: absolute;

left: 50%;
transform: translate(-50%, -50%);

@media screen and (min-height: 900px) {
width: 29vw; 
height: 26vh; 
}
`;


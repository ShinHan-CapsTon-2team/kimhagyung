import React from 'react';

import logo from '../Images/imagelogo.png'
import { useNavigate,useLocation } from 'react-router-dom';

import styled from "styled-components";

const Lookup = () => {
    
    const navigate = useNavigate();

    //홈페이지 이동 
    const handleGohomeClick = () => {
        navigate('/home');
    };

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const postid = params.get('name'); //게시글 구분할 키 읽어오기 


    return ( 
        //설명 없는 버전 
        <div style={{width: '100%', height: '100%', position: 'relative', background: 'white'}}>
        
            <div style={{ width: 496, height: 239,textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img style={{width: 496, height: 239, left: 0, top: 0, position: 'absolute'}} src={logo} alt='' onClick={handleGohomeClick}/> {/* 로고 이미지 크기 맞추기 */}
            </div> 

            <div style={{ display: 'flex',marginLeft:25,marginRight:25 }}>
            
                <div style={{ width:'70%' }}>
                    <div style={{  height: 'auto', opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid',padding: '20px' }}>
                        <div >
                            <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={logo}alt='이미지' />
                        </div>
                    </div>
                </div> 

                <div style={{width: '30%', marginLeft: 20 }}>
                    <div style={{ height: 81, opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid', display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word', paddingLeft: '20px' }}>
                            임승연
                        </div>
                    </div>

                    


                    <div style={{ height: 'auto', opacity: 0.90, background: 'white', borderRadius: 31, border: '3px #3A76EF solid', marginTop: 20, marginBottom: 10, padding: '10px', wordWrap: 'break-word' }}>
                        {/* 추가된 부분 시작 */}
                        <div style={{  borderRadius: 31 }}>
                            <div style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', paddingLeft: '10px', paddingRight: '20px' }}>설명kgsdfgksldkfgjhs;dkfhgsjkldfghlskjdlfhgkdjfsglhskjfdgh</div>
                        </div>
                        {/* 추가된 부분 끝 */}
                    </div>
                </div>   
            </div>
        </div>
    );
};

export default Lookup;
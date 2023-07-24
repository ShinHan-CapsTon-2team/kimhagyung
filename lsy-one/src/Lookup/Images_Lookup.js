import React from 'react';

import logo from '../Images/imagelogo.png'
const Images_Lookup = () => {
    return (
        //설명 있는 버전 
        <div style={{width: '100%', height: '100%', position: 'relative', background: 'white'}}>
        
            <div style={{ width: 496, height: 239,textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img style={{width: 496, height: 239, left: 0, top: 0, position: 'absolute'}} src={logo} alt='' />
            </div>


            
            <div style={{ display: 'flex',marginLeft:20,marginRight:20 }}>
                <div style={{ width:'70%' }}>
                    <div style={{  height: 81, opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid', marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word', paddingLeft: '20px' }}>제목</div>
                    </div>

                    <div style={{ height: 'auto', opacity: 0.90, background: 'white', borderRadius: 31, border: '3px #3A76EF solid', marginTop: 20, marginBottom: 10, padding: '20px', wordWrap: 'break-word' }}>
                        {/* 추가된 부분 시작 */}
                        <div style={{  borderRadius: 31 }}>
                            <div style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', paddingLeft: '20px', paddingRight: '20px' }}>설명kgsdfgksldkfgjhs;dkfhgsjkldfghlskjdlfhgkdjfsglhskjfdgh</div>
                        </div>
                        {/* 추가된 부분 끝 */}
                    </div>


                    <div style={{  height: 'auto', opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid',padding: '20px' }}>
                        <div >
                            <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://img.marieclairekorea.com/2016/01/KJH-167164-1-740x1110.jpg" alt='이미지' />
                        </div>
                    </div>
                </div> 

                <div style={{ marginLeft: 20 }}>
                    <div style={{ width: 491, height: 81, opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid', display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word', paddingLeft: '20px' }}>
                            임승연
                        </div>
                    </div>

                    <div style={{ width: 491, height: 521, opacity: 0.90, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 31, border: '3px #3A76EF solid', marginTop: 20 }}>
                        <div style={{ width: 317, color: 'black', fontSize: 40, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word', textAlign: 'center', marginTop: 10 }}>
                            소개 및 커리어
                        </div>
                    </div>
                </div>   
            </div>
        </div>
    );
};

export default Images_Lookup;
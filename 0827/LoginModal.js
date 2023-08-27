import styled from 'styled-components';
import naverlogin from '../Images/naverlogin.png'
import { useState, useEffect } from 'react';


export const ModalBackdrop = styled.div`
// Modal이 떴을 때의 배경을 깔아주는 CSS를 구현
width:100%;
height:100%;

z-index: 1; //위치지정 요소
position: fixed;
display : flex;
justify-content : center;
align-items : center;
background-color: rgba(0,0,0,0.4);
top : 0;
left : 0;
right : 0;
bottom : 0;


`;


export const ModalView = styled.div.attrs((props) => ({
// attrs 메소드를 이용해서 아래와 같이 div 엘리먼트에 속성을 추가할 수 있다.
role: 'dialog',
}))`
// Modal창 CSS를 구현합니다.

border-radius: 20px;
width: 35%;
height: 30%;
//height:8.5em;
background-color: #ffffff;

`;

const TextWrap= styled.div`
width: 100%;
height: 100%;
padding:30px;
box-sizing:border-box;
display: flex;
align-items: center;
flex-direction: column;
justify-content: center;
`;
const Text= styled.div`
font-size: 20px;
color: black;
margin-bottom:5%;
`;

const BtnLoginWrap = styled.div`
width:55%;
height:30%;

//height:1.5em;
`;

const BtnNaver = styled.img`
width:100%;
height:100%;
`;
export const LoginModal = () => {
const [accessToken, setAccessToken] = useState('');
const [userInfo, setUserInfo] = useState(null);


useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);
    
    if (code) {
        fetch('http://localhost:4001/api/example', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received data:',data.tokenData.access_token);

            if (data.userInfoData && data.tokenData.access_token) {  
                    setAccessToken(data.tokenData.access_token);

                    const userInfoData = data.userInfoData; // 서버에서 전달받은 사용자 정보 데이터
                    setUserInfo(userInfoData.response); // 사용자 정보를 상태로 설정
                    console.log('Received user:', userInfoData);
                
            }
            // 액세스 토큰을 로컬 스토리지에 저장합니다.
            localStorage.setItem('access_token', data.tokenData.access_token);
            // 로컬 스토리지에 액세스 토큰이 정상적으로 저장되었는지 확인하고 처리합니다.
            if (localStorage.getItem('access_token')) {
            console.log('액세스 토큰이 로컬 스토리지에 저장되었습니다.');
            } else {
            console.error('액세스 토큰 저장에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error fetching access token:', error);
        });
    }
    }, []);

// 네이버 로그인 처리하기 
const onNaverLogin = async () => {
    try {
        const response = await fetch('http://localhost:4001/api/naver-login', {
        method: 'POST', 
        });
        const data = await response.json();
        console.log(data); // 네이버 로그인 페이지로 리다이렉트.
        // 네이버 로그인 페이지로 리다이렉트
        window.location.href = data.naverLoginUrl;
    } catch (error) {
        console.error('Error during Naver login:', error);
    }
    };

return (
    <ModalView onClick={(e) => e.stopPropagation()}>
    
        <TextWrap>
            <Text>로그인 또는 회원가입 하세요.</Text>
            <BtnLoginWrap> 
                <BtnNaver src={naverlogin}  onClick={onNaverLogin} alt=''></BtnNaver>
            </BtnLoginWrap>
        </TextWrap>

    </ModalView>
    );
};
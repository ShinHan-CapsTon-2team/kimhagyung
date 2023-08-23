import React from 'react';
import naverLogin from '../Images/btnG.png'
function Login() {
  const handleNaverLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/naver-login', {
        method: 'POST', // POST 요청으로 변경
      });
      const data = await response.json();
      console.log(data); // 네이버 로그인 페이지로 리다이렉트될 것입니다.

      // 네이버 로그인 페이지로 리다이렉트
      window.location.href = data.naverLoginUrl;
    } catch (error) {
      console.error('Error during Naver login:', error);
    }
  };

  return (
    <div>
      <img
        src={naverLogin}
        alt="네이버 로그인"
        onClick={handleNaverLogin}
      />
    </div>
  );
}

export default Login;

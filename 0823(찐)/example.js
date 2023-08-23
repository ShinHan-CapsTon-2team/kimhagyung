import React, { useState, useEffect } from 'react';
import naverLogout from '../Images/btnG_out.png'

function Example() {
  const [accessToken, setAccessToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);
    
    if (code) {
      fetch('http://localhost:4000/api/example', {
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

  const handleLogout = () => {
    // 로컬 스토리지에서 액세스 토큰 제거
    localStorage.removeItem('access_token');
    setAccessToken('');
    setUserInfo(null);
    console.log("로그아웃 되었습니다.");
  };

  return (
    <div>
      <h1>네이버 로그인 예시</h1>
      {accessToken ? (
        <div>
          <p>액세스 토큰이 존재합니다.</p>
          <p>액세스 토큰: {accessToken}</p>
          {userInfo && (
            <div>
              <h2>사용자 정보</h2>
              <p>ID: {userInfo.id}</p>
              <p>Email: {userInfo.email}</p>
              <p>Name: {userInfo.name}</p>
              <p>NickName: {userInfo.nickname}</p>
            </div>
          )}
                <img
        src={naverLogout}
        alt="네이버 로그아웃"
        onClick={handleLogout}
      />
        </div>
      ) : (
        <p>액세스 토큰이 없습니다.</p>
      )}
    </div>
  );
}

export default Example;

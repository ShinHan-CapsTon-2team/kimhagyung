const express = require('express');
const qs = require('querystring');
const cors = require('cors');
const cookie = require('cookie'); // 추가된 부분
const connection = require('./DB_Connect'); 
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json()); // JSON 요청 바디를 파싱하기 위해 추가

const CLIENT_ID = '';
const CLIENT_SECRET = 'gIDzpOJtNv'; // 네이버 개발자 센터에서 발급받은 클라이언트 시크릿
const REDIRECT_URI = 'http://localhost:3000/home'; // 또는 클라이언트의 리다이렉트 URL
const REDIRECT_URI_ENCODED = encodeURIComponent(REDIRECT_URI);

app.post('/api/naver-login', (req, res) => {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_ENCODED}&state=STATE_STRING`;
  res.json({ naverLoginUrl: naverAuthUrl });
});


app.post('/api/example', async (req, res) => {
  const code = req.body.code;
  console.log('server_Received code:', code); // 콘솔에 받아온 code 출력
   if (!code) {
    console.error('Error: No code received'); // code가 없는 경우 오류 메시지 출력
    res.status(400).json({ error: 'No code received' }); // 클라이언트에게 400 Bad Request 상태와 오류 메시지 전달
    return;
  }

  const tokenRequestParams = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
  };

  try {
    const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(tokenRequestParams),
    });

    if (!tokenResponse.ok) {
      throw new Error('Token request failed');
    }

    const tokenData = await tokenResponse.json();
    console.log('server_Token data:', tokenData);

// 액세스 토큰을 사용하여 사용자 정보 가져오기
    const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET', // GET 요청으로 변경
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    // 리프레시 토큰을  HTTP-Only 쿠키에 저장합니다.
    // const refreshTokenCookie = cookie.serialize('refresh_token', tokenData.refresh_token, {
    //   httpOnly: true,
    //   secure: true, // HTTPS 연결에서만 쿠키 사용 (배포 시에는 필수)
    //   maxAge: 30 * 24 * 60 * 60, // 리프레시 토큰의 유효기간 설정 (예: 30일)
    //   sameSite: 'strict', // 보안 상 쿠키의 전송을 제한
    //   path: '/', // 쿠키가 적용될 경로
    // });
    // 쿠키를 클라이언트에게 전달합니다.
    //res.setHeader('Set-Cookie', refreshTokenCookie);

    const userInfoData = await userInfoResponse.json(); //사용자 정보 클라이언트로 보냄
    console.log('server_User info:', userInfoData.response); 

    const email = userInfoData.response.email;
    const nickname = userInfoData.response.nickname;
    
    const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
    const emailCheckValues = [email];
    
    connection.query(emailCheckQuery, emailCheckValues, (error, emailCheckResults) => {
      if (error) {
        console.error('Error checking email:', error);
        return;
      }
    
      if (emailCheckResults.length > 0) {
        console.log('Email already exists:', email);
      } else {
        // 중복된 이메일이 없을 경우 사용자 정보를 DB에 저장
        const insertQuery = 'INSERT INTO users (email, nickname) VALUES (?, ?)';
        const insertValues = [email, nickname];
    
        connection.query(insertQuery, insertValues, (insertError, insertResults) => {
          if (insertError) {
            console.error('Error adding user:', insertError);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
          console.log('New user added:', email);
        });
      }
      // 사용자 정보가 DB에 추가되었든 중복 여부에 상관없이 클라이언트에게 정보를 반환합니다.
      res.json({ tokenData, userInfoData });
    });
    
  } catch (error) {
    console.error('Error during Naver callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

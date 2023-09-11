const express = require('express');
const qs = require('querystring');
const cors = require('cors');
const cookie = require('cookie'); // 추가된 부분
const connection = require('./DB_Connect'); 

const app = express();
const port = 4001;


app.use(cors());
app.use(express.json()); // JSON 요청 바디를 파싱하기 위해 추가

const CLIENT_ID = 'h9gmSTTAv7u3aCx6zawU';
const CLIENT_SECRET = ''; // 네이버 개발자 센터에서 발급받은 클라이언트 시크릿
const REDIRECT_URI = 'http://localhost:3000/home'; // 또는 클라이언트의 리다이렉트 URL
const REDIRECT_URI_ENCODED = encodeURIComponent(REDIRECT_URI);

app.post('/api/naver-login', (req, res) => {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_ENCODED}&state=STATE_STRING`;
  res.json({ naverLoginUrl: naverAuthUrl });
});

app.post('/api/user', async (req, res) => {
  const { accessToken } = req.body;

  // 네이버 API를 통해 사용자 이메일 정보 가져오기
  const naverEmailEndpoint = "https://openapi.naver.com/v1/nid/me";
  const naverResponse = await fetch(naverEmailEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const naverData = await naverResponse.json();

  if (naverData.resultcode === "00") {
    const userEmail = naverData.response.email;
    const userNickname = naverData.response.nickname; 
    res.json({ email: userEmail, nickname: userNickname });
  } else {
    res.status(500).json({ error: "Failed to fetch user email" });
  }
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
      method: 'GET', 
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

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
    
        connection.query(insertQuery, insertValues, (insertError) => {
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

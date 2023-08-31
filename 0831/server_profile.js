const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./DB_Connect'); // Import the database connection
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// 프로필 수정 라우트
app.post('/api/profileEdit', (req, res) => {
  // 요청 데이터 가져오기
  const introduction = req.body.introduction;
  const career = req.body.career;
  const email = req.body.email;

  // 사용자 ID 찾기
  connection.query(
    `SELECT id FROM users WHERE email = ?`,
    [email],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }

      if (rows.length === 0) {
        res.status(400).send('Invalid email');
      }

      // 프로필 ID 찾기
      const profileId = rows[0].id;

      // 프로필 업데이트 여부 확인
      connection.query(
        `SELECT id FROM profiles WHERE user_id = ?`,
        [profileId],
        (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          }

          if (rows.length === 0) {
            // 프로필이 아직 존재하지 않으므로 생성합니다.
            connection.query(
              `INSERT INTO profiles (user_id, introduction, career) VALUES (?, ?, ?)`,
              [profileId, introduction, career],
              (err, rows) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('Internal Server Error');
                }
                // 프로필 정보 응답
                res.json({
                  message: 'Profile created successfully',
                  profile: {
                    introduction,
                    career,
                  },
                });
              },
            );
          }
        },
      );
    },
  );
});



const PORT = 4002;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 동작 중입니다.`);
});

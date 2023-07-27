const mysql = require('mysql');

const connection = mysql.createConnection({
//  host: '192.168.200.108', // MySQL 호스트 주소
  host:'10.11.6.26',
  user: 'ha', // MySQL 사용자 이름
  password: 'kimhg', // MySQL 비밀번호
  database: 'DB', // MySQL 데이터베이스 이름
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

module.exports = connection;




// // server.js

// const express = require('express');
// const app = express();
// const cors = require('cors');
// const mysql = require('mysql');

// app.use(cors());
// app.use(express.json());

// // MySQL 데이터베이스 연결 설정
// const connection = mysql.createConnection({
//   host: '192.168.65.254', // MySQL 호스트 주소
//   user: 'ha', // MySQL 사용자 이름
//   password: 'kimhg', // MySQL 비밀번호
//   database: 'DB', // MySQL 데이터베이스 이름
// });

// // MySQL 연결
// connection.connect((err) => {
//   if (err) {
//     console.error('MySQL connection failed: ' + err.stack);
//     return;
//   }
//   console.log('Connected to MySQL database as id ' + connection.threadId);
// });

// // 게시물 등록 API 엔드포인트
// app.post('/api/post', (req, res) => {
//   const data = req.body;

//   // MySQL에 데이터 삽입
//   const query = 'INSERT INTO posts (title, description, image_url, category, name, profile, upload_time) VALUES (?, ?, ?, ?, ?, ?, ?)';
//   const values = [data.title, data.description, data.image_url, data.category, data.name, data.profile, data.upload_time];

//   connection.query(query, values, (error, results, fields) => {
//     if (error) {
//       console.error('MySQL query error: ' + error.stack);
//       res.status(500).json({ message: '게시물 등록에 실패했습니다.' });
//     } else {
//       console.log('MySQL query result:', results);
//       res.json({ message: '게시물이 등록되었습니다.', data });
//     }
//   });
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`서버가 http://localhost:${PORT} 에서 동작 중입니다.`);
// });





// // server.js

// const express = require('express');
// const app = express();
// const cors = require('cors');

// app.use(cors());
// app.use(express.json());

// const posts = []; // 게시물을 저장할 배열

// // 게시물 등록 API 엔드포인트
// app.post('/api/post', (req, res) => {
//   const data = req.body;
//   posts.push(data);
//   res.json({ message: '게시물이 등록되었습니다.', data });
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`서버가 http://localhost:${PORT} 에서 동작 중입니다.`);
// });






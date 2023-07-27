const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./DB_Connect'); // Import the database connection

const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());

// 이미지를 저장할 디렉토리와 파일 이름 설정
/*const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// 이미지를 받을 수 있는 multer 미들웨어 생성
const upload = multer({ storage: storage});

app.post('/api/post', upload.single('image'), (req, res) => {
  const data = JSON.parse(req.body.data); // 데이터 파싱

  const formattedUploadTime = new Date(data.upload_time).toISOString().slice(0, 19).replace('T', ' ');

  const query = 'INSERT INTO posts (title, description, image_url, category, name, profile, upload_time) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [data.title, data.description, req.file.path, data.category, data.name, data.profile, formattedUploadTime];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      console.error('MySQL query error: ' + error.stack);
      res.status(500).json({ message: '게시물 등록에 실패했습니다.' });
    } else {
      console.log('MySQL query result:', results);
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.json({ message: '게시물이 등록되었습니다.', data });
    }
  });
});


app.get('/api/lookup/:id', (req, res) => {
  const { id } = req.params;

  // 데이터베이스에서 데이터를 가져오는 쿼리 작성
  const query = `SELECT * FROM posts WHERE id = ?`;

  // 쿼리 실행
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('데이터베이스 쿼리 에러:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      // 데이터를 찾지 못한 경우 404 Not Found 응답을 보냅니다.
      return res.status(404).json({ error: 'Data not found' });
    }

    // 데이터를 찾은 경우 해당 데이터를 응답으로 보냅니다.
    res.json(results[0]);
  });
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 동작 중입니다.`);
});

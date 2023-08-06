const express = require('express'); // npm i express 
const app = express();
const cors = require('cors'); //npm i cors
const connection = require('./DB_Connect'); 
//node i mysql 

const multer = require('multer'); //npm i multer
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 이미지를 저장할 디렉토리와 파일 이름 설정
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// 이미지를 받을 수 있는 multer 미들웨어 생성
const upload = multer({ storage });

app.post('/api/post', upload.single('image'), (req, res) => {
  const data = JSON.parse(req.body.data); // 데이터 파싱

  //const formattedUploadTime = new Date(data.upload_time).toISOString().slice(0, 19).replace('T', ' ');
  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  // 이미지 URL 인코딩하기
  //const imageUrl = encodeURIComponent(`http://localhost:4000/uploads/${req.file.filename}`);

  const query = 'INSERT INTO your_post (title, description, category, image_url, name, profile) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [data.title, data.description, data.category,imageUrl, data.name, data.profile];

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

app.get('/api/home/:category', (req, res) => {
    const category = req.params.category;
    const { limit, offset } = req.query;
    const parsedLimit = parseInt(limit) || 10;
    const parsedOffset = parseInt(offset) || 0;
    //const { _limit, _start } = req.query;

    const query = `SELECT id,image_url FROM your_post WHERE category = ? LIMIT ? OFFSET ?`;
    //const query = `SELECT id FROM your_post`;
    console.log('실행할 쿼리문:', query); 

    // 쿼리 실행
    connection.query(query, [category, parsedLimit, parsedOffset], (err, data) => {
      if (err) {
        console.error('데이터베이스 쿼리 에러:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (data.length === 0) {
         //데이터를 찾지 못한 경우 404 Not Found 응답을 보냅니다.
        return res.status(404).json({ error: 'Data not found' });
      }

      const dataArray = data.map((item) => ({
        id: item.id,
        image: item.image_url
      }));

      // 데이터를 찾은 경우 해당 데이터를 응답으로 보냅니다.
      res.json(dataArray);
    });

  });


app.get('/api/lookup', (req, res) => {
  connection.query("SELECT * FROM your_post", (err, data) => {
      if (err) {
          console.log('err');
          res.send(err);
      } else{
          console.log('success');
          res.send(data);
      }
  });
}); 

app.get('/api/lookup/:id', function(req,res,next) {
  var queryString = "SELECT * FROM your_post WHERE id = ?"
  var userId = req.params.id

  connection.query(queryString, [userId], (err,rows,fields) => {
    if(err){
      console.log(err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
})


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 동작 중입니다.`);
});
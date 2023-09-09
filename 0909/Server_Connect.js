const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./DB_Connect');
const PORT = 4000;
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // fs 모듈 추가

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 이미지를 저장할 디렉토리와 파일 이름 설정 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 클라이언트에서 보낸 데이터를 파싱하여 카테고리를 가져옵니다.
    const data = JSON.parse(req.body.data);
    const folder = data.category;
    const imageDir = `./public/uploads/${folder}/`;
    console.log("이미지 폴더 : ", imageDir);
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage });

app.post('/api/post', upload.single('image'), async (req, res) => {
  const data = JSON.parse(req.body.data);
  try {
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userInfoData = await userInfoResponse.json();
    const email = userInfoData.response.email;

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${data.category}/${req.file.filename}`;

    
        // 이미지 경로 및 카테고리에 대한 디렉토리 생성
    const imageDir = `./public/uploads/${data.category}/`;
    console.log("이미지 경로:",imageDir)
    console.log("이미지 파일 경로:", imageUrl);
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    const query = 'INSERT INTO your_post (title, description, category, image_url, email) VALUES (?, ?, ?, ?, ?)';
    const values = [data.title, data.description, data.category, imageUrl, email];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('MySQL query error: ' + error.stack);
        res.status(500).json({ message: '게시물 등록에 실패했습니다.' });
      } else {
        console.log('MySQL query result:', results);
        res.set('Content-Type', 'application/json; charset=utf-8');
        console.log('results :', results);
        const insertedId = results.insertId; // 삽입된 ID를 추출
        console.log('Inserted ID:', insertedId);
        //data: { ...data, id: insertedId } }
        res.json({ message: '게시물이 등록되었습니다.',data: { ...data, id: insertedId } });
      }
    });
  } catch (error) {
    console.error("Error during Naver callback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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


 //게시물 postedit로 보내기
 app.get('/api/postedit/:id', function(req,res,next) {
  var queryString = "SELECT title, category, description, image_url FROM your_post WHERE id = ?"
  var userId = req.params.id

  connection.query(queryString, [userId], (err,rows) => {
   if(err){
      console.log(err)
      res.sendStatus(500)
      return
    }
    const postArray = rows.map(row => ({
      title: row.title,
      category: row.category,
      description: row.description,
      name: row.name,
      image_url: row.image_url,
      
    }));
    res.json(postArray);
    //console.log(postArray);
  });
});
  

// 게시글 수정
app.put('/api/postedit/:id', upload.single('newImageFile'), (req, res) => {
  // 이미지 업로드와 관련된 코드
  const id = req.params.id;
  const data = JSON.parse(req.body.data); // 데이터 파싱
  console.log('받은 데이터:', data);

  const { title, description, category, image_url, imagePreviewUrl, newImageFile } = data;
  let imageUrl = image_url;

  if (req.file) {
    // 이미지가 업로드된 경우 새로운 이미지 URL 생성
    imageUrl = `http://localhost:4000/uploads/${category}/${req.file.filename}`;
  }

  // 게시글 수정
  const query = `UPDATE your_post SET title = ?, description = ?, category = ?, image_url = ? WHERE id = ?`;

  const values = [
    title,
    description,
    category,
    imageUrl,
    parseInt(id),
  ];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('MySQL query error: ' + error.stack);
      res.status(500).json({ message: '게시물 수정에 실패했습니다.' });
    } else {
      console.log('MySQL query result:', results);
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.json({ message: '게시물이 수정되었습니다.', data });
    }
  });
});



app.delete('/api/lookup/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);

  // MySQL에서 해당 ID의 게시물 삭제
  const deleteQuery = 'DELETE FROM your_post WHERE id = ?';
  connection.query(deleteQuery, [idToDelete], (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      res.status(500).json({ error: 'An error occurred while deleting the post.' });
    } else {
      console.log('Post deleted successfully');
      res.status(204).send(); // 성공적으로 삭제되었음을 응답
    }
  });
});



app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 동작 중입니다.`);
});
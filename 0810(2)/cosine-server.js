const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

const imageFolderPath = path.join(__dirname, 'public', 'cosine-img', 'family');
app.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트 도메인을 여기에 명시
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use('/cosine', cors(corsOptions), express.static(imageFolderPath));

app.get('/api/files', (req, res) => {
  fs.readdir(imageFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading image folder:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const imagePaths = files
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .map(file => `/cosine/${file}`); // 이미지 경로를 수정하여 접근 가능한 URL로 설정
    res.json(imagePaths);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
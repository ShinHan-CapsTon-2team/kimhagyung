const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4004;

const cosineImgFolderPath = path.join(__dirname, 'public', 'uploads');

app.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트 도메인을 여기에 명시
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use('/', cors(corsOptions), express.static(cosineImgFolderPath));

app.get('/api/images', (req, res) => {
  fs.readdir(cosineImgFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading image folder:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const imagePaths = files
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .map(file => `/${file}`);
    res.json(imagePaths);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

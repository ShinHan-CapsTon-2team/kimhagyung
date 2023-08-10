const express = require('express');
const path = require('path');

const app = express();
const port = 4000;

// 정적 파일 제공 설정
app.use('/images', express.static(path.join(__dirname, 'your_image_folder')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 서버 사이드 (Node.js 예시)
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.get('/image-list', async (req, res) => {
  const imageDir = path.join(__dirname, 'cosine-img', 'family');
  try {
    const files = await fs.readdir(imageDir);
    const imagePaths = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
                            .map(file => path.join('cosine-img', 'family', file));
    res.json(imagePaths);
  } catch (error) {
    console.error('Error reading image directory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

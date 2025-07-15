const express = require('express');
const filesData = require('./filesData.js'); // 引入 filesData.js

const app = express();
const port = 3004; // 設定伺服器端口

// 端點：返回所有文件資料
app.get('/api/files', (req, res) => {
  res.json(filesData); // 返回所有年份的文件資料
});

// 端點：根據年份返回文件資料
app.get('/api/files/:year', (req, res) => {
  const year = req.params.year;
  const files = filesData[year];

  if (files) {
    res.json(files); // 返回指定年份的文件資料
  } else {
    res.status(404).json({ message: '年份資料未找到' }); // 未找到資料
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`API 伺服器正在運行於 http://localhost:${port}`);
});

const express = require('express');
const partnersData = require('./partnersData.js'); // 引入 partnersData.js

const app = express();
const port = 3001; // 這裡設定為 3001，避免與先前的伺服器端口衝突

// 端點：返回所有的合作夥伴資料
app.get('/api/partners', (req, res) => {
  res.json(partnersData); // 返回所有合作夥伴資料
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`API 伺服器正在運行於 http://localhost:${port}`);
});

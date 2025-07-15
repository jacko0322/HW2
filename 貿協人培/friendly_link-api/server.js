const express = require('express');
const partnersData = require('./partnersData.js'); // 引入 partnersData.js

const app = express();
const port = 3001; // 設定為 3001，避免與其他伺服器端口衝突

// 端點：返回所有的合作夥伴資料
app.get('/api/partners', (req, res) => {
  try {
    res.json(partnersData); // 返回所有合作夥伴資料
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤', error: error.message });
  }
});

// 錯誤處理中間件（如果發生未處理的錯誤，會進入這裡）
app.use((err, req, res, next) => {
  console.error('錯誤發生:', err.message);
  res.status(500).json({ message: '伺服器錯誤', error: err.message });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`API 伺服器正在運行於 http://localhost:${port}`);
});

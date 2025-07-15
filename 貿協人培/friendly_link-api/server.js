const express = require('express');
const partnersData = require('./partnersData.js'); // 引入 partnersData.js

const router = express.Router();  // 使用 Router 來處理路由

// 端點：返回所有的合作夥伴資料
router.get('/api/partners', (req, res) => {
  try {
    res.json(partnersData); // 返回所有合作夥伴資料
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤', error: error.message });
  }
});

// 錯誤處理中間件（如果發生未處理的錯誤，會進入這裡）
router.use((err, req, res, next) => {
  console.error('錯誤發生:', err.message);
  res.status(500).json({ message: '伺服器錯誤', error: err.message });
});

module.exports = router;  // 將路由導出

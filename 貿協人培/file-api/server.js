const express = require('express');
const filesData = require('./filesData.js'); // 引入 filesData.js

const router = express.Router();  // 使用 Router 來處理路由

// 端點：返回所有文件資料
router.get('/', (req, res) => {
  res.json(filesData); // 返回所有年份的文件資料
});

// 端點：根據年份返回文件資料
router.get('/:year', (req, res) => {
  const year = req.params.year;
  const files = filesData[year];

  if (files) {
    res.json(files); // 返回指定年份的文件資料
  } else {
    res.status(404).json({ message: '年份資料未找到' }); // 未找到資料
  }
});

module.exports = router;  // 匯出路由


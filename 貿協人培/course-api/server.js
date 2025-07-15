const express = require('express');
const eventsData = require('./eventsData');  // 使用 require 引入資料

const router = express.Router();  // 使用 express.Router() 設置路由

// 端點：返回所有會展資料
router.get('/api/events', (req, res) => {
  res.json(eventsData); // 返回所有會展資料
});

// 端點：根據會展 ID 返回資料
router.get('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = eventsData.events.find(e => e.id === eventId);

  if (event) {
    res.json(event); // 返回指定會展資料
  } else {
    res.status(404).json({ message: '會展未找到' }); // 未找到會展
  }
});

module.exports = router;  // 匯出路由

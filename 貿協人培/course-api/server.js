const express = require('express');
const eventsData = require('./eventsData.js'); // 引入會展資料

const app = express();
const port = 3002; // 設定為 3002（你可以選擇其他端口）

// 端點：返回所有會展資料
app.get('/api/events', (req, res) => {
  res.json(eventsData); // 返回會展資料
});

// 端點：根據會展 ID 返回資料
app.get('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = eventsData.events.find(e => e.id === eventId);

  if (event) {
    res.json(event); // 返回指定會展資料
  } else {
    res.status(404).json({ message: '會展未找到' }); // 未找到會展
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`API 伺服器正在運行於 http://localhost:${port}`);
});

const express = require('express');
const newsData = require('./newsData.js');

const app = express();
const port = 3000;

// 端點：返回所有消息資料
app.get('/api/news', (req, res) => {
  res.json(newsData); // 返回所有資料
});

// 端點：返回所有類別
app.get('/api/categories', (req, res) => {
  res.json(newsData.categories); // 返回所有類別
});

// 端點：根據類別名稱返回消息
app.get('/api/news/category/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;
  const category = newsData.news.find(c => c.category === categoryName);

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: '類別未找到' });
  }
});

// 啟動 API 伺服器
app.listen(port, () => {
  console.log(`API 伺服器正在運行於 http://localhost:${port}`);
});

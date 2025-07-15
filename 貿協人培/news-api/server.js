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

// 端點：根據類別名稱返回最新五筆消息
app.get('/api/news/category/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;
  const category = newsData.news.find(c => c.category === categoryName);

  if (category) {
    // 根據時間排序，然後返回最新的 5 筆消息
    const latestNews = category.messages
      .sort((a, b) => new Date(b.update_date) - new Date(a.update_date)) // 按照 update_date 排序
      .slice(0, 5);  // 只取最新的 5 筆

    res.json({ category: categoryName, messages: latestNews });
  } else {
    res.status(404).json({ message: '類別未找到' });
  }
});

// 啟動 API 伺服器
app.listen(port, () => {
  console.log(`API 伺服器正在運行於 http://localhost:${port}`);
});

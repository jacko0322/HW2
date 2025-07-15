const express = require('express');
const faqData = require('./faqData.js'); // 引入常見問題資料

const app = express();
const port = 3003; // 設定伺服器端口（你可以更換為任何可用端口）

// 端點：返回所有常見問題資料
app.get('/api/faq', (req, res) => {
  try {
    res.json(faqData); // 返回常見問題資料
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤', error: error.message });
  }
});

// 端點：返回某個類別的常見問題資料
app.get('/api/faq/:id', (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = faqData.categories.find(c => c.id === categoryId);

    if (category) {
      res.json(category); // 返回指定類別的資料
    } else {
      res.status(404).json({ message: '類別未找到' }); // 顯示錯誤訊息
    }
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

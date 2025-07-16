const express = require('express');
const cors = require('cors');  // 引入 cors 模組
const newsApiRoutes = require('./news-api/server');  // 引入 news-api 路由
const courseApiRoutes = require('./course-api/server');  // 引入 course-api 路由
const fileApiRoutes = require('./file-api/server');  // 引入 file-api 路由
const friendlyLinkApiRoutes = require('./friendly_link-api/server');  // 引入 friendly-link-api 路由
const faqApiRoutes = require('./question-api/server');  // 引入 question-api 路由

const app = express();
const port = 3004;  // 設定主伺服器端口

app.use(cors());  // 使用 CORS

// 註冊各個模組的路由
app.use('/api/news', newsApiRoutes);  // 註冊 news-api 路由
app.use('/api/courses', courseApiRoutes);  // 註冊 course-api 路由
app.use('/api/files', fileApiRoutes);  // 註冊 file-api 路由
app.use('/api/friendly-links', friendlyLinkApiRoutes);  // 註冊 friendly-link-api 路由
app.use('/api/faq', faqApiRoutes);  // 註冊 question-api 路由

// 根路由，測試伺服器是否正常
app.get('/', (req, res) => {
  res.send('主伺服器正在運行！');
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`主伺服器正在運行於 http://localhost:${port}`);
});

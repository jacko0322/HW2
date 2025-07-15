const express = require('express');
const app = express();
const PORT = 3000;

// 引入模組的路由
const newsApiRoutes = require('./news-api/server');
const courseApiRoutes = require('./course-api/server');
const fileApiRoutes = require('./file-api/server');
const questionApiRoutes = require('./question-api/server');

// 使用這些路由
app.use('/api/news', newsApiRoutes); // 註冊 news-api 路由
app.use('/api/courses', courseApiRoutes); // 註冊 course-api 路由
app.use('/api/files', fileApiRoutes); // 註冊 file-api 路由
app.use('/api/questions', questionApiRoutes); // 註冊 question-api 路由

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器運行在 http://localhost:${PORT}`);
});

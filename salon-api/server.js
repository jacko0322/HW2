const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// 啟用 CORS 支援跨來源
app.use(cors());

// 設定靜態檔案目錄為 public
app.use(express.static(path.join(__dirname, 'public')));

// 沙龍職能資料
const salonJobData = [
  {
    "title": "資深設計師",
    "core_skills": ["剪髮設計", "溝通引導", "顧客服務"],
    "professional_skills": ["染髮技巧", "造型設計", "頭皮護理"],
    "experience": "3 年以上美髮經驗"
  },
  {
    "title": "助理設計師",
    "core_skills": ["洗髮服務", "染劑調配", "協助設計"],
    "professional_skills": ["護髮流程", "工具清潔", "接待流程"],
    "experience": "無需經驗，可培訓"
  },
  {
    "title": "美髮店長",
    "core_skills": ["團隊管理", "營運規劃", "顧客關係維護"],
    "professional_skills": ["行銷策略", "進貨管理", "服務監督"],
    "experience": "5 年以上管理經驗"
  }
];

// API 路由
app.get('/api/salon-jobs', (req, res) => {
  res.json(salonJobData);
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`✅ 沙龍職能 API 啟動：http://localhost:${port}`);
  console.log(`📄 靜態網頁入口：http://localhost:${port}/index.html`);
});

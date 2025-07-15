// eventsData.js - 儲存會展資料
module.exports = {
  "events": [
    {
      "id": 1,
      "title": "會展名稱 A",
      "image": "圖片路徑 A",
      "registration_status": "報名已截止",
      "location": "會展地點 A",
      "time": "上課日期 A",
      "time_period": "上課時段 A",
      "hours": "上課時數 A",
      "cost": "費用 A",
      "description": "課程介紹 A。",
      "link": [
        { "name": "官方網站", "url": "https://example.com/a" },
        { "name": "報名頁面", "url": "https://example.com/a/register" }
      ],
      "teachers": [
        {
          "tid": 1,
          "name": "講師名稱 A",
          "description": {
            "current_position": "現任職位 A",
            "subjects": "授課科目 A",
            "educational_qualifications": "學歷 A",
            "experience": "經歷 A"
          },
          "image": "講師照片 A"
        }
      ]
    },
    {
      "id": 2,
      "title": "會展名稱 B",
      "image": "圖片路徑 B",
      "registration_status": "報名中",
      "location": "會展地點 B",
      "time": "上課日期 B",
      "time_period": "上課時段 B",
      "hours": "上課時數 B",
      "cost": "費用 B",
      "description": "課程介紹 B。",
      "link": [
        { "name": "官方網站", "url": "https://example.com/b" },
        { "name": "報名頁面", "url": "https://example.com/b/register" }
      ],
      "teachers": [
        {
          "tid": 2,
          "name": "講師名稱 B",
          "description": {
            "current_position": "現任職位 B",
            "subjects": "授課科目 B",
            "educational_qualifications": "學歷 B",
            "experience": "經歷 B"
          },
          "image": "講師照片 B"
        }
      ]
    }
  ]
};

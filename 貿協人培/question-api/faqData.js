// faqData.js - 儲存常見問題資料
module.exports = {
  "categories": [
    {
      "title": "帳戶管理",
      "id": "account-management", 
      "questions": [
        {
          "question": "如何創建帳戶？",
          "answer": "您可以通過點擊註冊按鈕來創建帳戶，然後按照提示填寫您的資訊。"
        },
        {
          "question": "如何重設密碼？",
          "answer": "在登入頁面點擊“忘記密碼”，輸入您的註冊郵箱，然後按提示重設密碼。"
        }
      ]
    },
    {
      "title": "訂單問題",
      "id": "order-issues",
      "questions": [
        {
          "question": "如何查看訂單狀態？",
          "answer": "您可以在您的帳戶頁面查看所有訂單的詳細狀態。"
        },
        {
          "question": "如何取消訂單？",
          "answer": "如果您的訂單尚未發貨，可以在訂單詳情頁面點擊“取消訂單”進行取消。"
        }
      ]
    },
    {
      "title": "支付問題",
      "id": "payment-issues",
      "questions": [
        {
          "question": "我可以使用哪些支付方式？",
          "answer": "我們接受信用卡、PayPal 和銀行轉帳等多種支付方式。"
        },
        {
          "question": "支付時為何遇到錯誤？",
          "answer": "請確認您的支付資訊是否正確，並且確認您的支付方式是否支持該交易。"
        }
      ]
    }
  ]
};

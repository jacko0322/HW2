// api/books.js - Vercel API Routes
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // 設置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    try {
        // 讀取書籍資料
        const filePath = path.join(process.cwd(), 'domestic_books.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        res.status(200).json({
            success: true,
            type: 'domestic_books',
            message: '成功獲取國內書籍數據',
            data: data,
            count: data.books ? data.books.length : 0,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: '無法讀取書籍資料',
            details: error.message
        });
    }
}

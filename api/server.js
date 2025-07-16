const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 添加CORS中介軟體（終極版 - 解決Vercel CORS問題）
app.use((req, res, next) => {
  // 設置所有必要的CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-Forwarded-For, X-Real-IP');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Max-Age', '86400');
  
  // 確保不會有緩存問題
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  
  console.log(`🌐 ${req.method} 請求來自:`, req.headers.origin || 'unknown');
  
  // 處理預檢請求 - 直接返回200，不進入其他中間件
  if (req.method === 'OPTIONS') {
    console.log('✅ 處理OPTIONS預檢請求 - 直接返回200');
    return res.status(200).end();
  }
  
  next();
});

// 解析JSON請求
app.use(express.json());

// 所有JSON文件的配置（新增書籍文件，移除國內考試）
const dataFiles = {
    'international_courses': 'international_courses.json',
    'international_teachers': 'international_teachers.json',
    'international_exams': 'international_exam_data.json',
    'domestic_courses': 'domestic_courses.json',
    'domestic_teachers': 'domestic_teachers.json',
    'domestic_books': 'domestic_books.json'  // 🆕 新增書籍文件
};

// 讀取JSON文件的輔助函數
function readJSONFile(filename, callback) {
    const filePath = path.join(__dirname, filename);
    
    if (!fs.existsSync(filePath)) {
        return callback(new Error(`文件不存在: ${filename}`), null);
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ 讀取文件錯誤:', err);
            return callback(err, null);
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseErr) {
            console.error('❌ JSON解析錯誤:', parseErr);
            callback(parseErr, null);
        }
    });
}

// 首頁 - API文檔
app.get('/', (req, res) => {
    res.json({
        message: '🎓 MICE 課程與師資 API 服務器',
        version: '2.2.0',  // 🆕 版本更新
        description: '提供國際和國內課程、師資、考試、書籍數據的API服務',
        endpoints: {
            // 課程相關
            international_courses: 'GET /api/international_courses',
            domestic_courses: 'GET /api/domestic_courses',
            
            // 師資相關
            international_teachers: 'GET /api/international_teachers', 
            domestic_teachers: 'GET /api/domestic_teachers',
            
            // 考試相關
            international_exams: 'GET /api/international_exams',
            
            // 🆕 書籍相關
            domestic_books: 'GET /api/domestic_books',
            
            // 搜索功能
            search_courses: 'GET /api/search/courses?q=關鍵字&type=international|domestic',
            search_teachers: 'GET /api/search/teachers?q=關鍵字&type=international|domestic',
            search_exams: 'GET /api/search/exams?q=關鍵字&type=international',
            search_books: 'GET /api/search/books?q=關鍵字',  // 🆕 新增書籍搜索
            
            // 統計信息
            statistics: 'GET /api/statistics',
            
            // 系統狀態
            health: 'GET /health',
            files: 'GET /api/files'
        },
        examples: {
            international_courses: `http://localhost:${PORT}/api/international_courses`,
            international_exams: `http://localhost:${PORT}/api/international_exams`,
            domestic_books: `http://localhost:${PORT}/api/domestic_books`,  // 🆕 新增
            search_books: `http://localhost:${PORT}/api/search/books?q=會展`,  // 🆕 新增
            statistics: `http://localhost:${PORT}/api/statistics`
        },
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// 健康檢查
app.get('/health', (req, res) => {
    const fileStatus = {};
    let allFilesExist = true;
    
    // 檢查所有文件是否存在
    Object.entries(dataFiles).forEach(([key, filename]) => {
        const filePath = path.join(__dirname, filename);
        const exists = fs.existsSync(filePath);
        fileStatus[key] = {
            filename: filename,
            exists: exists,
            path: filePath
        };
        if (!exists) allFilesExist = false;
    });
    
    res.json({
        status: allFilesExist ? 'OK' : 'WARNING',
        message: allFilesExist ? 'API正常運行' : '部分文件缺失',
        files: fileStatus,
        server_info: {
            uptime: process.uptime(),
            memory_usage: process.memoryUsage(),
            node_version: process.version
        },
        timestamp: new Date().toISOString()
    });
});

// 文件列表API
app.get('/api/files', (req, res) => {
    const fileInfo = {};
    
    Object.entries(dataFiles).forEach(([key, filename]) => {
        const filePath = path.join(__dirname, filename);
        try {
            const stats = fs.statSync(filePath);
            fileInfo[key] = {
                filename: filename,
                exists: true,
                size: stats.size,
                modified: stats.mtime,
                readable: true
            };
        } catch (err) {
            fileInfo[key] = {
                filename: filename,
                exists: false,
                error: err.message
            };
        }
    });
    
    res.json({
        success: true,
        data: fileInfo,
        timestamp: new Date().toISOString()
    });
});

// 國際課程API
app.get('/api/international_courses', (req, res) => {
    console.log('📡 請求國際課程數據');
    
    readJSONFile(dataFiles.international_courses, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '無法讀取國際課程數據',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            type: 'international_courses',
            message: '成功獲取國際課程數據',
            data: data,
            count: data.courses ? data.courses.length : 0,
            timestamp: new Date().toISOString()
        });
    });
});

// 國內課程API
app.get('/api/domestic_courses', (req, res) => {
    console.log('📡 請求國內課程數據');
    
    readJSONFile(dataFiles.domestic_courses, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '無法讀取國內課程數據',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            type: 'domestic_courses',
            message: '成功獲取國內課程數據',
            data: data,
            count: data.courses ? data.courses.length : 0,
            timestamp: new Date().toISOString()
        });
    });
});

// 國際師資API
app.get('/api/international_teachers', (req, res) => {
    console.log('📡 請求國際師資數據');
    
    readJSONFile(dataFiles.international_teachers, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '無法讀取國際師資數據',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            type: 'international_teachers',
            message: '成功獲取國際師資數據',
            data: data,
            count: data.teachers ? data.teachers.length : 0,
            timestamp: new Date().toISOString()
        });
    });
});

// 國內師資API
app.get('/api/domestic_teachers', (req, res) => {
    console.log('📡 請求國內師資數據');
    
    readJSONFile(dataFiles.domestic_teachers, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '無法讀取國內師資數據',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            type: 'domestic_teachers',
            message: '成功獲取國內師資數據',
            data: data,
            count: data.teachers ? data.teachers.length : 0,
            timestamp: new Date().toISOString()
        });
    });
});

// 國際考試API
app.get('/api/international_exams', (req, res) => {
    console.log('📋 請求國際考試數據');
    
    readJSONFile(dataFiles.international_exams, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '無法讀取國際考試數據',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            type: 'international_exams',
            message: '成功獲取國際考試數據',
            data: data,
            count: data.exams ? data.exams.length : 0,
            timestamp: new Date().toISOString()
        });
    });
});

// 🆕 國內書籍API
app.get('/api/domestic_books', (req, res) => {
    console.log('📚 請求國內書籍數據');
    
    readJSONFile(dataFiles.domestic_books, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '無法讀取國內書籍數據',
                details: err.message
            });
        }
        
        res.json({
            success: true,
            type: 'domestic_books',
            message: '成功獲取國內書籍數據',
            data: data,
            count: data.books ? data.books.length : 0,
            timestamp: new Date().toISOString()
        });
    });
});

// 搜索課程
app.get('/api/search/courses', (req, res) => {
    const searchQuery = req.query.q;
    const searchType = req.query.type || 'all'; // international, domestic, all
    
    if (!searchQuery) {
        return res.status(400).json({
            success: false,
            error: '請提供搜索關鍵字',
            example: '/api/search/courses?q=CEM&type=international'
        });
    }
    
    console.log(`🔍 搜索課程: "${searchQuery}" (類型: ${searchType})`);
    
    const searchFiles = [];
    if (searchType === 'international' || searchType === 'all') {
        searchFiles.push({ key: 'international', file: dataFiles.international_courses });
    }
    if (searchType === 'domestic' || searchType === 'all') {
        searchFiles.push({ key: 'domestic', file: dataFiles.domestic_courses });
    }
    
    let completedSearches = 0;
    const results = { international: [], domestic: [] };
    let hasError = false;
    
    searchFiles.forEach(({ key, file }) => {
        readJSONFile(file, (err, data) => {
            if (err) {
                console.error(`搜索錯誤 ${key}:`, err);
                hasError = true;
            } else {
                const courses = data.courses || [];
                const searchTerm = searchQuery.toLowerCase();
                
                results[key] = courses.filter(course => 
                    (course.title && course.title.toLowerCase().includes(searchTerm)) ||
                    (course.description && course.description.toLowerCase().includes(searchTerm)) ||
                    (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
                    (course.location && course.location.toLowerCase().includes(searchTerm))
                );
            }
            
            completedSearches++;
            
            // 所有搜索完成後返回結果
            if (completedSearches === searchFiles.length) {
                if (hasError) {
                    return res.status(500).json({
                        success: false,
                        error: '搜索過程中發生錯誤'
                    });
                }
                
                const totalResults = results.international.length + results.domestic.length;
                
                res.json({
                    success: true,
                    message: `找到 ${totalResults} 個課程`,
                    search_query: searchQuery,
                    search_type: searchType,
                    results: results,
                    summary: {
                        international_count: results.international.length,
                        domestic_count: results.domestic.length,
                        total_count: totalResults
                    },
                    timestamp: new Date().toISOString()
                });
            }
        });
    });
});

// 搜索師資
app.get('/api/search/teachers', (req, res) => {
    const searchQuery = req.query.q;
    const searchType = req.query.type || 'all';
    
    if (!searchQuery) {
        return res.status(400).json({
            success: false,
            error: '請提供搜索關鍵字',
            example: '/api/search/teachers?q=張老師&type=international'
        });
    }
    
    console.log(`🔍 搜索師資: "${searchQuery}" (類型: ${searchType})`);
    
    const searchFiles = [];
    if (searchType === 'international' || searchType === 'all') {
        searchFiles.push({ key: 'international', file: dataFiles.international_teachers });
    }
    if (searchType === 'domestic' || searchType === 'all') {
        searchFiles.push({ key: 'domestic', file: dataFiles.domestic_teachers });
    }
    
    let completedSearches = 0;
    const results = { international: [], domestic: [] };
    let hasError = false;
    
    searchFiles.forEach(({ key, file }) => {
        readJSONFile(file, (err, data) => {
            if (err) {
                console.error(`搜索錯誤 ${key}:`, err);
                hasError = true;
            } else {
                const teachers = data.teachers || [];
                const searchTerm = searchQuery.toLowerCase();
                
                results[key] = teachers.filter(teacher => 
                    (teacher.name && teacher.name.toLowerCase().includes(searchTerm)) ||
                    (teacher.name_en && teacher.name_en.toLowerCase().includes(searchTerm)) ||
                    (teacher.organization && teacher.organization.toLowerCase().includes(searchTerm)) ||
                    (teacher.title && teacher.title.toLowerCase().includes(searchTerm))
                );
            }
            
            completedSearches++;
            
            if (completedSearches === searchFiles.length) {
                if (hasError) {
                    return res.status(500).json({
                        success: false,
                        error: '搜索過程中發生錯誤'
                    });
                }
                
                const totalResults = results.international.length + results.domestic.length;
                
                res.json({
                    success: true,
                    message: `找到 ${totalResults} 位師資`,
                    search_query: searchQuery,
                    search_type: searchType,
                    results: results,
                    summary: {
                        international_count: results.international.length,
                        domestic_count: results.domestic.length,
                        total_count: totalResults
                    },
                    timestamp: new Date().toISOString()
                });
            }
        });
    });
});

// 搜索考試（只保留國際考試）
app.get('/api/search/exams', (req, res) => {
    const searchQuery = req.query.q;
    const searchType = req.query.type || 'international'; // 只支持國際考試
    
    if (!searchQuery) {
        return res.status(400).json({
            success: false,
            error: '請提供搜索關鍵字',
            example: '/api/search/exams?q=CEM&type=international'
        });
    }
    
    console.log(`🔍 搜索考試: "${searchQuery}" (類型: ${searchType})`);
    
    // 只搜索國際考試
    if (searchType !== 'international') {
        return res.status(400).json({
            success: false,
            error: '目前只支持國際考試搜索',
            supported_types: ['international']
        });
    }
    
    readJSONFile(dataFiles.international_exams, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '搜索過程中發生錯誤',
                details: err.message
            });
        }
        
        const exams = data.exams || [];
        const searchTerm = searchQuery.toLowerCase();
        
        const results = exams.filter(exam => 
            (exam.title && exam.title.toLowerCase().includes(searchTerm)) ||
            (exam.description && exam.description.toLowerCase().includes(searchTerm)) ||
            (exam.exam_type && exam.exam_type.toLowerCase().includes(searchTerm)) ||
            (exam.tags && exam.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
        
        res.json({
            success: true,
            message: `找到 ${results.length} 個考試`,
            search_query: searchQuery,
            search_type: searchType,
            results: {
                international: results,
                domestic: []
            },
            summary: {
                international_count: results.length,
                domestic_count: 0,
                total_count: results.length
            },
            timestamp: new Date().toISOString()
        });
    });
});

// 🆕 搜索書籍
app.get('/api/search/books', (req, res) => {
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
        return res.status(400).json({
            success: false,
            error: '請提供搜索關鍵字',
            example: '/api/search/books?q=會展'
        });
    }
    
    console.log(`🔍 搜索書籍: "${searchQuery}"`);
    
    readJSONFile(dataFiles.domestic_books, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: '搜索過程中發生錯誤',
                details: err.message
            });
        }
        
        const books = data.books || [];
        const searchTerm = searchQuery.toLowerCase();
        
        const results = books.filter(book => 
            (book.title && book.title.toLowerCase().includes(searchTerm)) ||
            (book.fullTitle && book.fullTitle.toLowerCase().includes(searchTerm)) ||
            (book.category && book.category.toLowerCase().includes(searchTerm))
        );
        
        res.json({
            success: true,
            message: `找到 ${results.length} 本書籍`,
            search_query: searchQuery,
            results: results,
            summary: {
                total_count: results.length
            },
            timestamp: new Date().toISOString()
        });
    });
});

// 統計信息API（更新包含書籍統計，移除國內考試統計）
app.get('/api/statistics', (req, res) => {
    console.log('📊 請求統計信息');
    
    const stats = {
        international: { courses: 0, teachers: 0, exams: 0 },
        domestic: { courses: 0, teachers: 0, books: 0 },  // 🆕 將exams改為books
        total: { courses: 0, teachers: 0, exams: 0, books: 0 }  // 🆕 新增books統計
    };
    
    let completedReads = 0;
    const totalReads = 6;  // 保持6個文件
    let hasError = false;
    
    // 讀取國際課程
    readJSONFile(dataFiles.international_courses, (err, data) => {
        if (!err && data.courses) {
            stats.international.courses = data.courses.length;
        }
        completedReads++;
        checkCompletion();
    });
    
    // 讀取國際師資
    readJSONFile(dataFiles.international_teachers, (err, data) => {
        if (!err && data.teachers) {
            stats.international.teachers = data.teachers.length;
        }
        completedReads++;
        checkCompletion();
    });
    
    // 讀取國際考試
    readJSONFile(dataFiles.international_exams, (err, data) => {
        if (!err && data.exams) {
            stats.international.exams = data.exams.length;
        }
        completedReads++;
        checkCompletion();
    });
    
    // 讀取國內課程
    readJSONFile(dataFiles.domestic_courses, (err, data) => {
        if (!err && data.courses) {
            stats.domestic.courses = data.courses.length;
        }
        completedReads++;
        checkCompletion();
    });
    
    // 讀取國內師資
    readJSONFile(dataFiles.domestic_teachers, (err, data) => {
        if (!err && data.teachers) {
            stats.domestic.teachers = data.teachers.length;
        }
        completedReads++;
        checkCompletion();
    });
    
    // 🆕 讀取國內書籍（取代國內考試）
    readJSONFile(dataFiles.domestic_books, (err, data) => {
        if (!err && data.books) {
            stats.domestic.books = data.books.length;
        }
        completedReads++;
        checkCompletion();
    });
    
    function checkCompletion() {
        if (completedReads === totalReads) {
            // 計算總計
            stats.total.courses = stats.international.courses + stats.domestic.courses;
            stats.total.teachers = stats.international.teachers + stats.domestic.teachers;
            stats.total.exams = stats.international.exams;  // 只有國際考試
            stats.total.books = stats.domestic.books;  // 只有國內書籍
            
            res.json({
                success: true,
                message: '統計信息獲取成功',
                data: stats,
                summary: `總共 ${stats.total.courses} 個課程，${stats.total.teachers} 位師資，${stats.total.exams} 個考試，${stats.total.books} 本書籍`,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// 重定向處理
app.get('/api/international_exam_data', (req, res) => {
    console.log('🔄 重定向: /api/international_exam_data -> /api/international_exams');
    res.redirect('/api/international_exams');
});

app.get('/api/international_exam_data.json', (req, res) => {
    console.log('🔄 重定向: /api/international_exam_data.json -> /api/international_exams');
    res.redirect('/api/international_exams');
});

// 獲取所有可用的課程類型
app.get('/api/course-types', (req, res) => {
    try {
        const courseTypes = ['國際認證培訓', '國內認證培訓', '會展沙龍'];
        
        res.json({
            success: true,
            data: {
                course_types: courseTypes,
                total: courseTypes.length
            }
        });
        
    } catch (error) {
        console.error('Error fetching course types:', error);
        res.status(500).json({
            error: '服務器內部錯誤',
            message: error.message
        });
    }
});

// 處理帶.json後綴的請求（重定向到正確的API端點）
app.get('/api/international_courses.json', (req, res) => {
    console.log('🔄 重定向: /api/international_courses.json -> /api/international_courses');
    res.redirect('/api/international_courses');
});

app.get('/api/domestic_courses.json', (req, res) => {
    console.log('🔄 重定向: /api/domestic_courses.json -> /api/domestic_courses');
    res.redirect('/api/domestic_courses');
});

app.get('/api/international_teachers.json', (req, res) => {
    console.log('🔄 重定向: /api/international_teachers.json -> /api/international_teachers');
    res.redirect('/api/international_teachers');
});

app.get('/api/domestic_teachers.json', (req, res) => {
    console.log('🔄 重定向: /api/domestic_teachers.json -> /api/domestic_teachers');
    res.redirect('/api/domestic_teachers');
});

app.get('/api/international_exams.json', (req, res) => {
    console.log('🔄 重定向: /api/international_exams.json -> /api/international_exams');
    res.redirect('/api/international_exams');
});

// 🆕 新增書籍重定向
app.get('/api/domestic_books.json', (req, res) => {
    console.log('🔄 重定向: /api/domestic_books.json -> /api/domestic_books');
    res.redirect('/api/domestic_books');
});

// 404錯誤處理
app.use((req, res) => {
    console.log('❌ 404錯誤 - 找不到路由:', req.method, req.url);
    res.status(404).json({
        success: false,
        error: 'API路由不存在',
        requested_path: req.url,
        method: req.method,
        available_routes: [
            'GET /',
            'GET /health',
            'GET /api/files',
            'GET /api/international_courses',
            'GET /api/domestic_courses', 
            'GET /api/international_teachers',
            'GET /api/domestic_teachers',
            'GET /api/international_exams',
            'GET /api/domestic_books',  // 🆕 新增
            'GET /api/search/courses?q=關鍵字&type=類型',
            'GET /api/search/teachers?q=關鍵字&type=類型',
            'GET /api/search/exams?q=關鍵字&type=international',
            'GET /api/search/books?q=關鍵字',  // 🆕 新增
            'GET /api/statistics'
        ]
    });
});

// 啟動服務器
app.listen(PORT, () => {
    console.log('🚀 MICE API 服務器啟動成功！');
    console.log('=====================================');
    console.log(`📍 服務器地址: http://localhost:${PORT}`);
    console.log(`📚 API文檔: http://localhost:${PORT}`);
    console.log(`🏥 健康檢查: http://localhost:${PORT}/health`);
    console.log('=====================================');
    console.log('📋 可用的API端點:');
    console.log(`🌍 國際課程: http://localhost:${PORT}/api/international_courses`);
    console.log(`🏠 國內課程: http://localhost:${PORT}/api/domestic_courses`);
    console.log(`👨‍🏫 國際師資: http://localhost:${PORT}/api/international_teachers`);
    console.log(`👨‍🎓 國內師資: http://localhost:${PORT}/api/domestic_teachers`);
    console.log(`📋 國際考試: http://localhost:${PORT}/api/international_exams`);
    console.log(`📚 國內書籍: http://localhost:${PORT}/api/domestic_books`);  // 🆕 新增
    console.log(`🔍 搜索課程: http://localhost:${PORT}/api/search/courses?q=CEM&type=international`);
    console.log(`🔍 搜索師資: http://localhost:${PORT}/api/search/teachers?q=教授&type=all`);
    console.log(`🔍 搜索考試: http://localhost:${PORT}/api/search/exams?q=認證&type=international`);
    console.log(`🔍 搜索書籍: http://localhost:${PORT}/api/search/books?q=會展`);  // 🆕 新增
    console.log(`📊 統計信息: http://localhost:${PORT}/api/statistics`);
    console.log('=====================================');
    
    // 檢查文件狀態
    console.log('📁 檢查數據文件:');
    Object.entries(dataFiles).forEach(([key, filename]) => {
        const filePath = path.join(__dirname, filename);
        const exists = fs.existsSync(filePath);
        console.log(`${exists ? '✅' : '❌'} ${filename} ${exists ? '存在' : '缺失'}`);
    });
    console.log('=====================================');
});

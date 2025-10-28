const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const si = require('systeminformation');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://d3js.org"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Base paths
const BASE_DIR = __dirname;
const UPLOAD_FOLDER = path.join(BASE_DIR, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// File upload configuration
const ALLOWED_EXTENSIONS = new Set(['txt', 'md', 'csv', 'log']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext);
        const safeName = `${uuidv4()}_${baseName}${ext}`;
        cb(null, safeName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().substring(1);
        if (ALLOWED_EXTENSIONS.has(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed. Allowed: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`));
        }
    }
});

// Platform-aware executable paths
const isWindows = process.platform === 'win32';
const FILE_PROCESSOR_EXE = path.join(BASE_DIR, 'backend', isWindows ? 'file_processor.exe' : 'file_processor');
const ENCRYPTOR_EXE = path.join(BASE_DIR, 'backend', isWindows ? 'encryptor.exe' : 'encryptor');

// Utility functions
function runExecutable(execPath, args = [], input = null, timeout = 15000) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(execPath)) {
            reject(new Error(`Executable not found: ${execPath}`));
            return;
        }

        const process = spawn(execPath, args);
        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(new Error(stderr || `Process exited with code ${code}`));
            }
        });

        process.on('error', (error) => {
            reject(error);
        });

        // Set timeout
        const timer = setTimeout(() => {
            process.kill();
            reject(new Error('Process timeout'));
        }, timeout);

        process.on('close', () => {
            clearTimeout(timer);
        });

        // Send input if provided
        if (input) {
            process.stdin.write(input);
        }
        process.stdin.end();
    });
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { output: '' });
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.render('index', { output: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        
        try {
            const output = await runExecutable(FILE_PROCESSOR_EXE, [filePath]);
            res.render('index', { output: output });
        } catch (error) {
            res.render('index', { output: `Error processing file: ${error.message}` });
        } finally {
            // Clean up uploaded file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    } catch (error) {
        res.render('index', { output: `Upload error: ${error.message}` });
    }
});

app.post('/encrypt', async (req, res) => {
    try {
        const text = req.body.text;
        
        if (!text || text.trim() === '') {
            return res.render('index', { output: 'No text provided to encrypt.' });
        }

        try {
            const output = await runExecutable(ENCRYPTOR_EXE, [], text, 10000);
            res.render('index', { output: output });
        } catch (error) {
            res.render('index', { output: `Encryption error: ${error.message}` });
        }
    } catch (error) {
        res.render('index', { output: `Request error: ${error.message}` });
    }
});

app.get('/sysinfo', async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const memory = await si.mem();
        
        const cpuUsage = cpu.currentLoad.toFixed(1);
        const memoryUsage = ((memory.used / memory.total) * 100).toFixed(1);
        
        const output = `CPU Usage: ${cpuUsage}%\nMemory Usage: ${memoryUsage}%`;
        res.render('index', { output: output });
    } catch (error) {
        res.render('index', { output: `System info error: ${error.message}` });
    }
});

// API endpoints for AJAX requests
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, output: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        
        try {
            const output = await runExecutable(FILE_PROCESSOR_EXE, [filePath]);
            res.json({ success: true, output: output });
        } catch (error) {
            res.json({ success: false, output: `Error processing file: ${error.message}` });
        } finally {
            // Clean up uploaded file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    } catch (error) {
        res.json({ success: false, output: `Upload error: ${error.message}` });
    }
});

app.post('/api/encrypt', async (req, res) => {
    try {
        const text = req.body.text;
        
        if (!text || text.trim() === '') {
            return res.json({ success: false, output: 'No text provided to encrypt.' });
        }

        try {
            const output = await runExecutable(ENCRYPTOR_EXE, [], text, 10000);
            res.json({ success: true, output: output });
        } catch (error) {
            res.json({ success: false, output: `Encryption error: ${error.message}` });
        }
    } catch (error) {
        res.json({ success: false, output: `Request error: ${error.message}` });
    }
});

app.get('/api/sysinfo', async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const memory = await si.mem();
        
        const cpuUsage = cpu.currentLoad.toFixed(1);
        const memoryUsage = ((memory.used / memory.total) * 100).toFixed(1);
        
        const output = `CPU Usage: ${cpuUsage}%\nMemory Usage: ${memoryUsage}%`;
        res.json({ success: true, output: output });
    } catch (error) {
        res.json({ success: false, output: `System info error: ${error.message}` });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.render('index', { output: 'File too large. Maximum size is 10MB.' });
        }
    }
    res.render('index', { output: `Server error: ${error.message}` });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('index', { output: 'Page not found.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Secure Dashboard server running on http://localhost:${PORT}`);
    console.log(`📁 Upload folder: ${UPLOAD_FOLDER}`);
    console.log(`🔧 File processor: ${FILE_PROCESSOR_EXE}`);
    console.log(`🔐 Encryptor: ${ENCRYPTOR_EXE}`);
});

module.exports = app;
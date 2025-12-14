const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// MIDDLEWARE
// ===========================
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ===========================
// STATIC FILES
// ===========================
// Serve static files from the web directory
app.use(express.static(path.join(__dirname, '../web')));

// ===========================
// ROUTES
// ===========================

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Library Management System Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API proxy configuration (optional - if you want to proxy API requests)
// This allows the frontend to make requests to /api/* which will be forwarded to the Python backend
const API_URL = process.env.API_URL || 'http://localhost:5000';

app.use('/api/*', async (req, res) => {
    try {
        const apiPath = req.originalUrl.replace('/api', '');
        const targetUrl = `${API_URL}/api${apiPath}`;

        const fetch = (await import('node-fetch')).default;

        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, options);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        console.error('API Proxy Error:', error);
        res.status(500).json({
            error: 'Failed to communicate with API server',
            message: error.message
        });
    }
});

// ===========================
// ERROR HANDLING
// ===========================

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../web/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ===========================
// SERVER START
// ===========================
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   Library Management System - Node.js Server   ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API proxy configured for ${API_URL}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, '../web')}`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT signal received: closing HTTP server');
    process.exit(0);
});

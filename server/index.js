const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index');
const path = require('path');

// CORS Options
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,             
};

app.use(cors(corsOptions));
app.options('*', cors());

app.use(express.json());
app.use(cookiesParser());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API endpoints
app.use('/api', router);

// Serve React app for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Database connection and server startup
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at http://localhost:" + PORT);
    });
});

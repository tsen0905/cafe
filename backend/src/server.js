require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const menuItemRoutes = require('./routes/menuItemRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafedb';

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());

// Routes
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Root
app.get('/', (req, res) => {
    res.send('Cafe Manager API is running');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
});

// Connect DB & Start Server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB at ${MONGO_URI}`);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const sectionRoutes = require('./routes/sections');
const trustPartnerRoutes = require('./routes/trustPartners');
const beforeAfterRoutes = require('./routes/beforeAfter');
const roiConfigRoutes = require('./routes/roiConfig');
const uploadRoutes = require('./routes/upload');
const heroRoutes = require('./routes/hero');
const ctaRoutes = require('./routes/cta');
const marqueeRoutes = require('./routes/marquee');
const caseStudyRoutes = require('./routes/caseStudies');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/trust-partners', trustPartnerRoutes);
app.use('/api/before-after', beforeAfterRoutes);
app.use('/api/roi-config', roiConfigRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/cta', ctaRoutes);
app.use('/api/marquee', marqueeRoutes);
app.use('/api/case-studies', caseStudyRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: { message: 'Route not found', status: 404 } });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

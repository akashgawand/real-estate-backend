const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadToR2, validateImage } = require('../services/uploadService');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

// Upload image to R2
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: { message: 'No file uploaded' } });
        }

        // Validate image
        validateImage(req.file);

        // Upload to R2
        const publicUrl = await uploadToR2(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.json({
            url: publicUrl,
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: { message: error.message || 'Failed to upload image' } });
    }
});

module.exports = router;

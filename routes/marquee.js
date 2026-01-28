const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get marquee settings (public)
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.marqueeSettings.findFirst();
        res.json(settings);
    } catch (error) {
        console.error('Get marquee settings error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch marquee settings' } });
    }
});

// Update marquee settings (admin)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const existing = await prisma.marqueeSettings.findFirst();

        let settings;
        if (existing) {
            settings = await prisma.marqueeSettings.update({
                where: { id: existing.id },
                data: req.body,
            });
        } else {
            settings = await prisma.marqueeSettings.create({
                data: req.body,
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Update marquee settings error:', error);
        res.status(500).json({ error: { message: 'Failed to update marquee settings' } });
    }
});

module.exports = router;

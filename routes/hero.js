const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get hero content (public)
router.get('/', async (req, res) => {
    try {
        const hero = await prisma.heroContent.findFirst();
        res.json(hero);
    } catch (error) {
        console.error('Get hero content error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch hero content' } });
    }
});

// Update hero content (admin)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Check if hero content exists
        const existing = await prisma.heroContent.findFirst();

        let hero;
        if (existing) {
            hero = await prisma.heroContent.update({
                where: { id: existing.id },
                data: req.body,
            });
        } else {
            hero = await prisma.heroContent.create({
                data: req.body,
            });
        }

        res.json(hero);
    } catch (error) {
        console.error('Update hero content error:', error);
        res.status(500).json({ error: { message: 'Failed to update hero content' } });
    }
});

module.exports = router;

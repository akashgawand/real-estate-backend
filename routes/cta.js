const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get CTA section content (public)
router.get('/', async (req, res) => {
    try {
        const cta = await prisma.cTASection.findFirst();
        res.json(cta);
    } catch (error) {
        console.error('Get CTA content error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch CTA content' } });
    }
});

// Update CTA section (admin)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const existing = await prisma.cTASection.findFirst();

        let cta;
        if (existing) {
            cta = await prisma.cTASection.update({
                where: { id: existing.id },
                data: req.body,
            });
        } else {
            cta = await prisma.cTASection.create({
                data: req.body,
            });
        }

        res.json(cta);
    } catch (error) {
        console.error('Update CTA content error:', error);
        res.status(500).json({ error: { message: 'Failed to update CTA content' } });
    }
});

module.exports = router;

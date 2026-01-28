const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all sections (public)
router.get('/', async (req, res) => {
    try {
        const sections = await prisma.landingSection.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(sections);
    } catch (error) {
        console.error('Get sections error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch sections' } });
    }
});

// Get visible sections (public)
router.get('/visible', async (req, res) => {
    try {
        const sections = await prisma.landingSection.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' },
        });
        res.json(sections);
    } catch (error) {
        console.error('Get visible sections error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch visible sections' } });
    }
});

// Update section (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const section = await prisma.landingSection.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });

        res.json(section);
    } catch (error) {
        console.error('Update section error:', error);
        res.status(500).json({ error: { message: 'Failed to update section' } });
    }
});

// Reorder sections (admin)
router.put('/reorder', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { sections } = req.body; // Array of { id, order }

        if (!Array.isArray(sections)) {
            return res.status(400).json({ error: { message: 'Sections must be an array' } });
        }

        // Update each section's order
        const updates = sections.map(({ id, order }) =>
            prisma.landingSection.update({
                where: { id },
                data: { order },
            })
        );

        await prisma.$transaction(updates);

        res.json({ message: 'Sections reordered successfully' });
    } catch (error) {
        console.error('Reorder sections error:', error);
        res.status(500).json({ error: { message: 'Failed to reorder sections' } });
    }
});

module.exports = router;

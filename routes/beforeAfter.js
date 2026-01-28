const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all before/after entries (public)
router.get('/', async (req, res) => {
    try {
        const entries = await prisma.beforeAfter.findMany({
            where: { isVisible: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(entries);
    } catch (error) {
        console.error('Get before/after error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch before/after entries' } });
    }
});

// Get all entries including hidden (admin)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const entries = await prisma.beforeAfter.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(entries);
    } catch (error) {
        console.error('Get all before/after error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch before/after entries' } });
    }
});

// Create before/after entry (admin)
router.post('/', authenticateToken, requireAdmin, [
    body('title').trim().notEmpty(),
    body('beforeImageUrl').trim().notEmpty(),
    body('afterImageUrl').trim().notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
        }

        const entry = await prisma.beforeAfter.create({
            data: req.body,
        });

        res.status(201).json(entry);
    } catch (error) {
        console.error('Create before/after error:', error);
        res.status(500).json({ error: { message: 'Failed to create before/after entry' } });
    }
});

// Update before/after entry (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const entry = await prisma.beforeAfter.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });

        res.json(entry);
    } catch (error) {
        console.error('Update before/after error:', error);
        res.status(500).json({ error: { message: 'Failed to update before/after entry' } });
    }
});

// Delete before/after entry (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.beforeAfter.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.json({ message: 'Before/after entry deleted successfully' });
    } catch (error) {
        console.error('Delete before/after error:', error);
        res.status(500).json({ error: { message: 'Failed to delete before/after entry' } });
    }
});

module.exports = router;

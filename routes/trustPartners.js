const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all trust partners (public)
router.get('/', async (req, res) => {
    try {
        const partners = await prisma.trustPartner.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' },
        });
        res.json(partners);
    } catch (error) {
        console.error('Get trust partners error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch trust partners' } });
    }
});

// Get all partners including hidden (admin)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const partners = await prisma.trustPartner.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(partners);
    } catch (error) {
        console.error('Get all trust partners error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch trust partners' } });
    }
});

// Create trust partner (admin)
router.post('/', authenticateToken, requireAdmin, [
    body('name').trim().notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
        }

        // Get max order
        const maxOrder = await prisma.trustPartner.findFirst({
            orderBy: { order: 'desc' },
            select: { order: true },
        });

        const partner = await prisma.trustPartner.create({
            data: {
                ...req.body,
                order: maxOrder ? maxOrder.order + 1 : 0,
            },
        });

        res.status(201).json(partner);
    } catch (error) {
        console.error('Create trust partner error:', error);
        res.status(500).json({ error: { message: 'Failed to create trust partner' } });
    }
});

// Update trust partner (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const partner = await prisma.trustPartner.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });

        res.json(partner);
    } catch (error) {
        console.error('Update trust partner error:', error);
        res.status(500).json({ error: { message: 'Failed to update trust partner' } });
    }
});

// Delete trust partner (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.trustPartner.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.json({ message: 'Trust partner deleted successfully' });
    } catch (error) {
        console.error('Delete trust partner error:', error);
        res.status(500).json({ error: { message: 'Failed to delete trust partner' } });
    }
});

// Reorder trust partners (admin)
router.post('/reorder', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { partners } = req.body; // Array of { id, order }

        if (!Array.isArray(partners)) {
            return res.status(400).json({ error: { message: 'Partners must be an array' } });
        }

        const updates = partners.map(({ id, order }) =>
            prisma.trustPartner.update({
                where: { id },
                data: { order },
            })
        );

        await prisma.$transaction(updates);

        res.json({ message: 'Trust partners reordered successfully' });
    } catch (error) {
        console.error('Reorder trust partners error:', error);
        res.status(500).json({ error: { message: 'Failed to reorder trust partners' } });
    }
});

module.exports = router;

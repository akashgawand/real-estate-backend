const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all ROI configurations (public)
router.get('/', async (req, res) => {
    try {
        const configs = await prisma.roiConfig.findMany({
            orderBy: { propertyType: 'asc' },
        });
        res.json(configs);
    } catch (error) {
        console.error('Get ROI config error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch ROI configurations' } });
    }
});

// Get ROI config by property type (public)
router.get('/:propertyType', async (req, res) => {
    try {
        const config = await prisma.roiConfig.findUnique({
            where: { propertyType: req.params.propertyType },
        });

        if (!config) {
            return res.status(404).json({ error: { message: 'ROI config not found' } });
        }

        res.json(config);
    } catch (error) {
        console.error('Get ROI config error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch ROI configuration' } });
    }
});

// Calculate ROI estimate (public)
router.post('/calculate', [
    body('propertyType').trim().notEmpty(),
    body('investmentAmount').isFloat({ min: 0 }),
    body('years').isInt({ min: 1, max: 30 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
        }

        const { propertyType, investmentAmount, years } = req.body;

        const config = await prisma.roiConfig.findUnique({
            where: { propertyType },
        });

        if (!config) {
            return res.status(404).json({ error: { message: 'ROI config not found for this property type' } });
        }

        // Simple ROI calculation (can be customized)
        const avgRoi = (config.roiPercentageMin + config.roiPercentageMax) / 2;
        const totalReturn = investmentAmount * Math.pow(1 + avgRoi / 100, years);
        const totalProfit = totalReturn - investmentAmount;

        res.json({
            investmentAmount,
            years,
            propertyType,
            roiPercentageMin: config.roiPercentageMin,
            roiPercentageMax: config.roiPercentageMax,
            avgRoiPercentage: avgRoi,
            estimatedTotalReturn: Math.round(totalReturn),
            estimatedProfit: Math.round(totalProfit),
            disclaimerText: config.disclaimerText,
        });
    } catch (error) {
        console.error('Calculate ROI error:', error);
        res.status(500).json({ error: { message: 'Failed to calculate ROI' } });
    }
});

// Update ROI config (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const config = await prisma.roiConfig.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });

        res.json(config);
    } catch (error) {
        console.error('Update ROI config error:', error);
        res.status(500).json({ error: { message: 'Failed to update ROI configuration' } });
    }
});

module.exports = router;

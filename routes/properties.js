const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all properties (public)
router.get('/', async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(properties);
    } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch properties' } });
    }
});

// Get featured properties (public) - mapped to Project interface
router.get('/featured', async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            where: { isFeatured: true },
            orderBy: { createdAt: 'desc' },
        });

        // Map to Project interface expected by frontend
        const projects = properties.map(property => {
            // Compute status based on creation date (recent = Ongoing, older = Completed)
            const monthsOld = (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
            const status = monthsOld < 6 ? 'Ongoing' : 'Completed';

            return {
                id: property.id,
                title: property.title,
                description: property.description || '',
                location: property.location,
                imageUrl: property.imageUrl,
                projectType: property.propertyType, // Map propertyType to projectType
                status: status,
            };
        });

        res.json(projects);
    } catch (error) {
        console.error('Get featured properties error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch featured properties' } });
    }
});

// Get single property (public)
router.get('/:id', async (req, res) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!property) {
            return res.status(404).json({ error: { message: 'Property not found' } });
        }

        res.json(property);
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch property' } });
    }
});

// Create property (admin)
router.post('/', authenticateToken, requireAdmin, [
    body('title').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('location').trim().notEmpty(),
    body('imageUrl').trim().notEmpty(),
    body('propertyType').trim().notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: { message: 'Invalid input', details: errors.array() } });
        }

        const property = await prisma.property.create({
            data: req.body,
        });

        res.status(201).json(property);
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ error: { message: 'Failed to create property' } });
    }
});

// Update property (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const property = await prisma.property.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });

        res.json(property);
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({ error: { message: 'Failed to update property' } });
    }
});

// Delete property (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.property.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({ error: { message: 'Failed to delete property' } });
    }
});

module.exports = router;

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Public: Get all visible case studies (ordered)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        if (page && limit) {
            const skip = (page - 1) * limit;
            const [data, total] = await prisma.$transaction([
                prisma.caseStudy.findMany({
                    where: { isVisible: true },
                    orderBy: { displayOrder: 'asc' },
                    skip: skip,
                    take: limit
                }),
                prisma.caseStudy.count({ where: { isVisible: true } })
            ]);
            return res.json({
                data,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        // If limit is provided without page (e.g. for landing page)
        if (limit) {
            const data = await prisma.caseStudy.findMany({
                where: { isVisible: true },
                orderBy: { displayOrder: 'asc' },
                take: limit
            });
            return res.json({ data });
        }

        // Default: return all
        const caseStudies = await prisma.caseStudy.findMany({
            where: { isVisible: true },
            orderBy: { displayOrder: 'asc' },
        });
        res.json({ data: caseStudies }); // Standardizing response structure to { data: [] }
    } catch (error) {
        console.error('Error fetching case studies:', error);
        res.status(500).json({ error: { message: 'Failed to fetch case studies' } });
    }
});

// Public: Get single case study
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const caseStudy = await prisma.caseStudy.findUnique({
            where: { id: parseInt(id) },
        });

        if (!caseStudy) {
            return res.status(404).json({ error: { message: 'Case study not found' } });
        }

        res.json(caseStudy);
    } catch (error) {
        console.error('Error fetching case study:', error);
        res.status(500).json({ error: { message: 'Failed to fetch case study' } });
    }
});

// Admin: Get all case studies (including hidden)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const caseStudies = await prisma.caseStudy.findMany({
            orderBy: { displayOrder: 'asc' },
        });
        res.json(caseStudies);
    } catch (error) {
        console.error('Error fetching all case studies:', error);
        res.status(500).json({ error: { message: 'Failed to fetch case studies' } });
    }
});

// Admin: Create new case study
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, location, category, description, imageUrl, year, status, isVisible, displayOrder } = req.body;

        const caseStudy = await prisma.caseStudy.create({
            data: {
                title,
                location,
                category,
                description,
                imageUrl,
                year: parseInt(year),
                status,
                isVisible: isVisible !== undefined ? isVisible : true,
                displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
            },
        });

        res.status(201).json(caseStudy);
    } catch (error) {
        console.error('Error creating case study:', error);
        res.status(500).json({ error: { message: 'Failed to create case study' } });
    }
});

// Admin: Update case study
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, category, description, imageUrl, year, status, isVisible, displayOrder } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (location !== undefined) updateData.location = location;
        if (category !== undefined) updateData.category = category;
        if (description !== undefined) updateData.description = description;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (year !== undefined) updateData.year = parseInt(year);
        if (status !== undefined) updateData.status = status;
        if (isVisible !== undefined) updateData.isVisible = isVisible;
        if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);

        const caseStudy = await prisma.caseStudy.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json(caseStudy);
    } catch (error) {
        console.error('Error updating case study:', error);
        res.status(500).json({ error: { message: 'Failed to update case study' } });
    }
});

// Admin: Delete case study
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.caseStudy.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Case study deleted successfully' });
    } catch (error) {
        console.error('Error deleting case study:', error);
        res.status(500).json({ error: { message: 'Failed to delete case study' } });
    }
});

// Admin: Reorder case studies
router.put('/reorder/bulk', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { caseStudies } = req.body; // Array of { id, displayOrder }

        const updatePromises = caseStudies.map((cs) =>
            prisma.caseStudy.update({
                where: { id: cs.id },
                data: { displayOrder: cs.displayOrder },
            })
        );

        await Promise.all(updatePromises);
        res.json({ message: 'Case studies reordered successfully' });
    } catch (error) {
        console.error('Error reordering case studies:', error);
        res.status(500).json({ error: { message: 'Failed to reorder case studies' } });
    }
});

module.exports = router;

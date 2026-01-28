const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create hero content
    const hero = await prisma.heroContent.upsert({
        where: { id: 1 },
        update: {},
        create: {
            headline: 'Find Your Dream Property',
            subheadline: 'Discover premium real estate opportunities with exceptional ROI potential',
            ctaText: 'Explore Properties',
            ctaLink: '#featured',
            bgImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
        },
    });
    console.log('✅ Hero content created');

    // Create ROI configurations
    const roiConfigs = [
        {
            propertyType: 'Building',
            roiPercentageMin: 8.5,
            roiPercentageMax: 12.0,
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            disclaimerText: 'ROI estimates are illustrative only and not guaranteed. Actual returns may vary.',
        },
        {
            propertyType: 'Shop',
            roiPercentageMin: 10.0,
            roiPercentageMax: 15.0,
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
            disclaimerText: 'ROI estimates are illustrative only and not guaranteed. Actual returns may vary.',
        },
        {
            propertyType: 'Plot',
            roiPercentageMin: 6.0,
            roiPercentageMax: 10.0,
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
            disclaimerText: 'ROI estimates are illustrative only and not guaranteed. Actual returns may vary.',
        },
        {
            propertyType: 'Commercial',
            roiPercentageMin: 12.0,
            roiPercentageMax: 18.0,
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
            disclaimerText: 'ROI estimates are illustrative only and not guaranteed. Actual returns may vary.',
        },
    ];

    for (const config of roiConfigs) {
        await prisma.roiConfig.upsert({
            where: { propertyType: config.propertyType },
            update: {},
            create: config,
        });
    }
    console.log('✅ ROI configurations created');

    // Create CTA section
    const cta = await prisma.cTASection.upsert({
        where: { id: 1 },
        update: {},
        create: {
            heading: 'Ready to Invest?',
            subheading: 'Get in touch with our expert team to find the perfect property for your portfolio',
            ctaText: 'Contact Us',
            ctaLink: '/contact',
            whatsappNumber: '+1234567890',
        },
    });
    console.log('✅ CTA section created');

    // Create marquee settings
    const marquee = await prisma.marqueeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            isEnabled: true,
            speed: 50,
        },
    });
    console.log('✅ Marquee settings created');

    // Create landing sections
    const sections = [
        { sectionKey: 'hero', title: 'Hero Section', isVisible: true, order: 0 },
        { sectionKey: 'previousWork', title: 'Previous Work', isVisible: true, order: 1 },
        { sectionKey: 'featured', title: 'Featured Properties', isVisible: true, order: 2 },
        { sectionKey: 'beforeAfter', title: 'Transformations', isVisible: true, order: 3 },
        { sectionKey: 'roiEstimator', title: 'ROI Estimator', isVisible: true, order: 4 },
        { sectionKey: 'trust', title: 'Trust Partners', isVisible: true, order: 5 },
        { sectionKey: 'cta', title: 'Call to Action', isVisible: true, order: 6 },
    ];

    for (const section of sections) {
        await prisma.landingSection.upsert({
            where: { sectionKey: section.sectionKey },
            update: {},
            create: section,
        });
    }
    console.log('✅ Landing sections created');

    // Create sample properties
    const properties = [
        {
            title: 'Modern Apartment in Downtown',
            description: 'Luxurious 3-bedroom apartment with city views',
            price: 750000,
            location: 'New York, NY',
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            isFeatured: true,
            propertyType: 'Building',
            bedrooms: 3,
            bathrooms: 2,
            area: 1500,
        },
        {
            title: 'Premium Commercial Space',
            description: 'High-traffic retail location in prime area',
            price: 1200000,
            location: 'Los Angeles, CA',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            isFeatured: true,
            propertyType: 'Commercial',
            area: 3000,
        },
        {
            title: 'Residential Plot',
            description: 'Prime plot ready for development',
            price: 350000,
            location: 'Austin, TX',
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
            isFeatured: true,
            propertyType: 'Plot',
            area: 5000,
        },
    ];

    for (const property of properties) {
        await prisma.property.create({ data: property });
    }
    console.log('✅ Sample properties created');

    // Create sample trust partners
    const partners = [
        { name: 'Forbes', isTextBased: true, isVisible: true, order: 0 },
        { name: 'Bloomberg', isTextBased: true, isVisible: true, order: 1 },
        { name: 'Wall Street Journal', isTextBased: true, isVisible: true, order: 2 },
        { name: 'Real Estate Weekly', isTextBased: true, isVisible: true, order: 3 },
        { name: 'Property Times', isTextBased: true, isVisible: true, order: 4 },
    ];

    for (const partner of partners) {
        await prisma.trustPartner.create({ data: partner });
    }
    console.log('✅ Trust partners created');

    // Create sample before/after transformations
    const beforeAfterData = [
        {
            title: 'Residential Plot Transformation',
            description: 'Complete development from bare land to beautiful residential complex',
            beforeImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
            afterImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
            isVisible: true,
        },
        {
            title: 'Commercial Space Renovation',
            description: 'Modern transformation of a dated office building into a contemporary workspace',
            beforeImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
            afterImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
            isVisible: true,
        },
        {
            title: 'Luxury Villa Development',
            description: 'From concept to completion - creating an architectural masterpiece',
            beforeImageUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1200&q=80',
            afterImageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
            isVisible: true,
        },
    ];

    for (const item of beforeAfterData) {
        await prisma.beforeAfter.create({ data: item });
    }
    console.log('✅ Before/After entries created');

    // Create case studies / previous work
    const caseStudies = [
        {
            title: 'Skyline Residences',
            location: 'Mumbai, Maharashtra',
            category: 'Residential',
            description: 'Transformed a 2-acre plot into a 24-story luxury residential tower with 180 units, achieving 100% pre-launch sales within 45 days.',
            imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            year: 2023,
            status: 'Completed',
            isVisible: true,
            displayOrder: 0,
        },
        {
            title: 'Heritage Commercial Hub',
            location: 'Bangalore, Karnataka',
            category: 'Commercial',
            description: 'Adaptive reuse of a 1920s warehouse into a mixed-use commercial complex, preserving architectural heritage while delivering 40,000 sq ft of premium retail and office space.',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
            year: 2024,
            status: 'Ongoing',
            isVisible: true,
            displayOrder: 1,
        },
        {
            title: 'Emerald Villas',
            location: 'Goa',
            category: 'Villa',
            description: 'Boutique development of 12 luxury villas with private pools and ocean views, sold at 35% premium over initial projections.',
            imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
            year: 2023,
            status: 'Completed',
            isVisible: true,
            displayOrder: 2,
        },
        {
            title: 'Tech Park Phase II',
            location: 'Pune, Maharashtra',
            category: 'Commercial',
            description: 'Developed 5 lakh sq ft of Grade-A office space with LEED Platinum certification, fully leased to Fortune 500 tenants before completion.',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
            year: 2022,
            status: 'Completed',
            isVisible: true,
            displayOrder: 3,
        },
        {
            title: 'Riverside Plots',
            location: 'Nashik, Maharashtra',
            category: 'Plot',
            description: 'Master-planned 50-acre gated community with 200 residential plots, complete infrastructure, and 40% green cover. 85% sold within first year.',
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
            year: 2024,
            status: 'Ongoing',
            isVisible: true,
            displayOrder: 4,
        },
        {
            title: 'Urban Lofts',
            location: 'Delhi NCR',
            category: 'Residential',
            description: 'Converted industrial building into 45 contemporary loft apartments with 14-foot ceilings, attracting young professionals and creatives.',
            imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
            year: 2023,
            status: 'Completed',
            isVisible: true,
            displayOrder: 5,
        },
    ];

    for (const caseStudy of caseStudies) {
        await prisma.caseStudy.create({ data: caseStudy });
    }
    console.log('✅ Case studies created');


    console.log('🎉 Database seed completed successfully!');
    console.log('\n📝 Default Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the admin password after first login!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

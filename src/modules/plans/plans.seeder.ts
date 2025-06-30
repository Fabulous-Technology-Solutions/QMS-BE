import Plan from './plans.modal';

export const seedPlans = async () => {
    try {
        // Clear existing plans
        await Plan.deleteMany({});

        // Define the plans based on the subscription tiers
        const plans = [
            {
                name: 'Document Control',
                slug: 'document-control',
                description: 'Comprehensive document lifecycle management',
                category: 'document-control' as const,
                pricing: {
                    monthly: 600,
                    yearly: 6000,
                    currency: 'USD',
                },
                features: [
                    { name: 'Version control and automated document history', included: true },
                    { name: 'Multi-level document approval workflows', included: true },
                    { name: 'Role-based access permissions', included: true },
                    { name: 'Audit-ready logs and change tracking', included: true },
                    { name: 'Change history and watermarking', included: true },
                    { name: 'ISO 9001, FDA 21 CFR Part 11, and GxP standards compliance', included: true },
                ],
                userLimit: 10,
                workspaceLimit: 1,
                cloudStorage: 100,
                emailBoarding: true,
                certifications: ['ISO 9001', 'ISO 13485'],
                isActive: true,
                isPopular: false,
            },
            {
                name: 'Audit Management',
                slug: 'audit-management',
                description: 'Streamlined audit planning and execution',
                category: 'audit-management' as const,
                pricing: {
                    monthly: 450,
                    yearly: 4500,
                    currency: 'USD',
                },
                features: [
                    { name: 'Audit scheduling and calendar management', included: true },
                    { name: 'Pre-configured and customizable checklists', included: true },
                    { name: 'Nonconformance recording and tracking', included: true },
                    { name: 'Evidence attachments and action item linking', included: true },
                    { name: 'Detailed audit trail and report generation', included: true },
                    { name: 'Post audit evaluation surveys', included: true },
                ],
                userLimit: 10,
                workspaceLimit: 1,
                cloudStorage: 150,
                emailBoarding: true,
                certifications: ['ISO 9001', 'FDA 21 CFR Part 820'],
                isActive: true,
                isPopular: true,
            },
            {
                name: 'CAPA Management',
                slug: 'capa-management',
                description: 'Corrective and Preventive Action tracking',
                category: 'capa-management' as const,
                pricing: {
                    monthly: 300,
                    yearly: 3000,
                    currency: 'USD',
                },
                features: [
                    { name: 'Full CAPA lifecycle management (Initiation to Closure)', included: true },
                    { name: 'Root Cause Analysis tools (5Whys, Fishbone)', included: true },
                    { name: 'Action plan assignment with deadline', included: true },
                    { name: 'Approval workflow and effectiveness', included: true },
                    { name: 'Linked records (audits, risks, documents)', included: true },
                    { name: 'Effectiveness verification', included: true },
                ],
                userLimit: 10,
                workspaceLimit: 1,
                cloudStorage: 120,
                emailBoarding: true,
                certifications: ['ISO 9001', 'ISO 13485'],
                isActive: true,
                isPopular: false,
            },
            {
                name: 'Risk Management',
                slug: 'risk-management',
                description: 'Proactive risk identification and mitigation',
                category: 'risk-management' as const,
                pricing: {
                    monthly: 300,
                    yearly: 3000,
                    currency: 'USD',
                },
                features: [
                    { name: 'Risk identification and assessment matrix', included: true },
                    { name: 'Assessment history tracking', included: true },
                    { name: 'Risk scoring and prioritization engine', included: true },
                    { name: 'Mitigation action tracking', included: true },
                    { name: 'Configurable risk categories and controls', included: true },
                    { name: 'Root Cause Analysis tools (5 Whys, Fishbone)', included: true },
                ],
                userLimit: 10,
                workspaceLimit: 1,
                cloudStorage: 100,
                emailBoarding: true,
                certifications: ['ISO 14971', 'ICH Q9'],
                isActive: true,
                isPopular: false,
            },
        ];


        // Insert plans
        const createdPlans = await Plan.insertMany(plans);
        console.log(`Successfully seeded ${createdPlans.length} plans`);

        return createdPlans;
    } catch (error) {
        console.error('Error seeding plans:', error);
        throw error;
    }
};

export const getPlansOverview = async () => {
    try {
        const allPlans = await Plan.getActivePlans();
        const plansByCategory = await Promise.all([
            Plan.getActiveByCategory('document-control'),
            Plan.getActiveByCategory('audit-management'),
            Plan.getActiveByCategory('capa-management'),
            Plan.getActiveByCategory('risk-management'),
        ]);

        return {
            allPlans,
            documentControl: plansByCategory[0],
            auditManagement: plansByCategory[1],
            capaManagement: plansByCategory[2],
            riskManagement: plansByCategory[3],
        };
    } catch (error) {
        console.error('Error fetching plans overview:', error);
        throw error;
    }
};

import Plan, { IPlanDoc } from './plans.modal';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import subscriptionUtils from '../utils/subscription.utils';

/**
 * Interface for plan with Stripe price IDs (plain object)
 */
interface IPlanWithStripeIds {
    _id: any;
    name: string;
    slug: string;
    description: string;
    category: 'document-control' | 'audit-management' | 'capa-management' | 'risk-management';
    pricing: {
        monthly: number;
        yearly: number;
        currency: string;
    };
    features: Array<{
        name: string;
        description?: string;
        included: boolean;
    }>;
    userLimit: number;
    workspaceLimit: number;
    cloudStorage: number;
    emailBoarding: boolean;
    certifications: string[];
    isActive: boolean;
    isPopular: boolean;
    createdAt: Date;
    updatedAt: Date;
    yearlyPriceId?: string;
    monthlyPriceId?: string;
}

/**
 * Get all active plans
 * @returns {Promise<IPlanWithStripeIds[]>}
 */

export const getAllPlans = async (): Promise<Array<IPlanWithStripeIds>> => {
    try {
        const [stripeProducts, stripePrices, plans] = await Promise.all([
            subscriptionUtils.getProducts(),
            subscriptionUtils.getPrices(),
            Plan.find({})
        ]);
        
        const plansWithStripeIds = plans.map(plan => {
            const planObj = plan.toObject();
            
            // Find matching Stripe product by category (stored in metadata)
            const matchingProduct = stripeProducts.data?.find((product: any) => 
                product.metadata?.category === plan.category
            );
            
            let yearlyPriceId: string | undefined;
            let monthlyPriceId: string | undefined;
            
            if (matchingProduct) {
                // Find prices for this product
                const productPrices = stripePrices.data?.filter((price: any) => 
                    price.product === matchingProduct.id
                );
                
                // Find yearly and monthly prices
                yearlyPriceId = productPrices?.find((price: any) => 
                    price.recurring?.interval === 'year'
                )?.id;
                
                monthlyPriceId = productPrices?.find((price: any) => 
                    price.recurring?.interval === 'month'
                )?.id;
            }
            
            return {
                ...planObj,
                yearlyPriceId,
                monthlyPriceId
            } as IPlanWithStripeIds;
        });

        console.log('Active Plans:', plansWithStripeIds);
        return plansWithStripeIds;
    } catch (error) {
        console.error('Error fetching plans with Stripe data:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch plans');
    }
};

/**
 * Get all active plans (alternative method without Stripe integration)
 * @returns {Promise<IPlanWithStripeIds[]>}
 */
export const getAllPlansBasic = async (): Promise<Array<IPlanWithStripeIds>> => {
    try {
        const plans = await Plan.find({});
        
        const plansWithStripeIds = plans.map(plan => {
            const planObj = plan.toObject();
            
            return {
                ...planObj,
                yearlyPriceId: planObj.yearlyPriceId,
                monthlyPriceId: planObj.monthlyPriceId
            } as IPlanWithStripeIds;
        });

        return plansWithStripeIds;
    } catch (error) {
        console.error('Error fetching plans:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch plans');
    }
};

/**
 * Get plans by category
 * @param {string} category
 * @returns {Promise<IPlanDoc[]>}
 */
export const getPlansByCategory = async (category: string): Promise<IPlanDoc[]> => {
    const validCategories = ['document-control', 'audit-management', 'capa-management', 'risk-management'];

    if (!validCategories.includes(category)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid plan category');
    }

    return Plan.getActiveByCategory(category);
};

/**
 * Get popular plans
 * @returns {Promise<IPlanDoc[]>}
 */
export const getPopularPlans = async (): Promise<IPlanDoc[]> => {
    return Plan.getPopularPlans();
};

/**
 * Get plan by slug
 * @param {string} slug
 * @returns {Promise<IPlanDoc>}
 */
export const getPlanBySlug = async (slug: string): Promise<IPlanDoc> => {
    const plan = await Plan.findOne({ slug, isActive: true });
    if (!plan) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
    }
    return plan;
};

/**
 * Get plan by ID
 * @param {string} planId
 * @returns {Promise<IPlanDoc>}
 */
export const getPlanById = async (planId: string): Promise<IPlanDoc> => {
    const plan = await Plan.findById(planId);
    if (!plan) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
    }
    return plan;
};

/**
 * Calculate pricing with discount
 * @param {IPlanDoc} plan
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {object}
 */
export const calculatePricing = (plan: IPlanDoc, billingCycle: 'monthly' | 'yearly') => {
    const yearlyDiscount = plan.toObject().yearlyDiscount || 0;

    const pricing = {
        monthly: plan.pricing.monthly,
        yearly: plan.pricing.yearly,
        currency: plan.pricing.currency,
        billingCycle,
        amount: billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly,
        yearlyDiscount,
    };

    if (billingCycle === 'yearly') {
        pricing.amount = plan.pricing.yearly;
    }

    return pricing;
};

/**
 * Get plan comparison data
 * @returns {Promise<object>}
 */
export const getPlanComparison = async () => {
    const plans = await Plan.getActivePlans();

    const comparison = {
        categories: ['document-control', 'audit-management', 'capa-management', 'risk-management'],
        plans: plans.map((plan: IPlanDoc) => ({
            id: plan._id,
            name: plan.name,
            slug: plan.slug,
            category: plan.category,
            description: plan.description,
            pricing: {
                monthly: plan.pricing.monthly,
                yearly: plan.pricing.yearly,
                currency: plan.pricing.currency,
                yearlyDiscount: plan.toObject().yearlyDiscount || 0,
            },
            features: plan.features,
            userLimit: plan.userLimit,
            workspaceLimit: plan.workspaceLimit,
            cloudStorage: plan.cloudStorage,
            emailBoarding: plan.emailBoarding,
            certifications: plan.certifications,
            isPopular: plan.isPopular,
        })),
    };

    return comparison;
};

/**
 * Create a new plan (Admin only)
 * @param {object} planData
 * @returns {Promise<IPlanDoc>}
 */
export const createPlan = async (planData: any): Promise<IPlanDoc> => {
    const plan = await Plan.create(planData);
    return plan;
};

/**
 * Update plan by ID (Admin only)
 * @param {string} planId
 * @param {object} updateData
 * @returns {Promise<IPlanDoc>}
 */
export const updatePlan = async (planId: string, updateData: any): Promise<IPlanDoc> => {
    const plan = await getPlanById(planId);
    Object.assign(plan, updateData);
    await plan.save();
    return plan;
};

/**
 * Delete plan by ID (Admin only)
 * @param {string} planId
 * @returns {Promise<void>}
 */
export const deletePlan = async (planId: string): Promise<void> => {
    const plan = await getPlanById(planId);
    await plan.deleteOne();
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.createPlan = exports.getPlanComparison = exports.calculatePricing = exports.getPlanById = exports.getPlanBySlug = exports.getPopularPlans = exports.getPlansByCategory = exports.getAllPlansBasic = exports.getAllPlans = void 0;
const plans_modal_1 = __importDefault(require("./plans.modal"));
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const subscription_utils_1 = __importDefault(require("../utils/subscription.utils"));
/**
 * Get all active plans
 * @returns {Promise<IPlanWithStripeIds[]>}
 */
const getAllPlans = async (user) => {
    try {
        console.log("user:", user);
        const userId = user?._id; // or wherever it comes from
        const matchConditions = [];
        if (userId) {
            matchConditions.push({
                $lookup: {
                    from: "subscriptions",
                    let: { planId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$planId", "$$planId"] },
                                        { $eq: ["$userId", userId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "subscription"
                }
            }, {
                $unwind: {
                    path: '$subscription',
                    preserveNullAndEmptyArrays: true
                }
            });
        }
        const [stripeProducts, stripePrices, plans] = await Promise.all([
            subscription_utils_1.default.getProducts(),
            subscription_utils_1.default.getPrices(),
            plans_modal_1.default.aggregate([
                { $match: { isActive: true } },
                ...matchConditions,
            ])
        ]);
        console.log('Stripe Products:', plans);
        const plansWithStripeIds = plans.map(plan => {
            const planObj = plan;
            // Find matching Stripe product by category (stored in metadata)
            const matchingProduct = stripeProducts.data?.find((product) => product.metadata?.category === plan.category);
            let yearlyPriceId;
            let monthlyPriceId;
            if (matchingProduct) {
                // Find prices for this product
                const productPrices = stripePrices.data?.filter((price) => price.product === matchingProduct.id);
                // Find yearly and monthly prices
                yearlyPriceId = productPrices?.find((price) => price.recurring?.interval === 'year')?.id;
                monthlyPriceId = productPrices?.find((price) => price.recurring?.interval === 'month')?.id;
            }
            return {
                ...planObj,
                yearlyPriceId,
                monthlyPriceId,
                subscription: {
                    status: plan?.subscription?.status,
                    billingCycle: plan?.subscription?.billingCycle
                }
            };
        });
        console.log('Active Plans:', plansWithStripeIds);
        return plansWithStripeIds;
    }
    catch (error) {
        console.error('Error fetching plans with Stripe data:', error);
        throw new errors_1.ApiError('Failed to fetch plans', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.getAllPlans = getAllPlans;
/**
 * Get all active plans (alternative method without Stripe integration)
 * @returns {Promise<IPlanWithStripeIds[]>}
 */
const getAllPlansBasic = async () => {
    try {
        const plans = await plans_modal_1.default.find({});
        const plansWithStripeIds = plans.map(plan => {
            const planObj = plan.toObject();
            return {
                ...planObj,
                yearlyPriceId: planObj.yearlyPriceId,
                monthlyPriceId: planObj.monthlyPriceId
            };
        });
        return plansWithStripeIds;
    }
    catch (error) {
        console.error('Error fetching plans:', error);
        throw new errors_1.ApiError('Failed to fetch plans', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.getAllPlansBasic = getAllPlansBasic;
/**
 * Get plans by category
 * @param {string} category
 * @returns {Promise<IPlanDoc[]>}
 */
const getPlansByCategory = async (category) => {
    const validCategories = ['document-control', 'audit-management', 'capa-management', 'risk-management'];
    if (!validCategories.includes(category)) {
        throw new errors_1.ApiError('Invalid plan category', http_status_1.default.BAD_REQUEST);
    }
    return plans_modal_1.default.getActiveByCategory(category);
};
exports.getPlansByCategory = getPlansByCategory;
/**
 * Get popular plans
 * @returns {Promise<IPlanDoc[]>}
 */
const getPopularPlans = async () => {
    return plans_modal_1.default.getPopularPlans();
};
exports.getPopularPlans = getPopularPlans;
/**
 * Get plan by slug
 * @param {string} slug
 * @returns {Promise<IPlanDoc>}
 */
const getPlanBySlug = async (slug) => {
    const plan = await plans_modal_1.default.findOne({ slug, isActive: true });
    if (!plan) {
        throw new errors_1.ApiError('Plan not found', http_status_1.default.NOT_FOUND);
    }
    return plan;
};
exports.getPlanBySlug = getPlanBySlug;
/**
 * Get plan by ID
 * @param {string} planId
 * @returns {Promise<IPlanDoc>}
 */
const getPlanById = async (planId) => {
    const plan = await plans_modal_1.default.findById(planId);
    if (!plan) {
        throw new errors_1.ApiError('Plan not found', http_status_1.default.NOT_FOUND);
    }
    return plan;
};
exports.getPlanById = getPlanById;
/**
 * Calculate pricing with discount
 * @param {IPlanDoc} plan
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @returns {object}
 */
const calculatePricing = (plan, billingCycle) => {
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
exports.calculatePricing = calculatePricing;
/**
 * Get plan comparison data
 * @returns {Promise<object>}
 */
const getPlanComparison = async () => {
    const plans = await plans_modal_1.default.getActivePlans();
    const comparison = {
        categories: ['document-control', 'audit-management', 'capa-management', 'risk-management'],
        plans: plans.map((plan) => ({
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
exports.getPlanComparison = getPlanComparison;
/**
 * Create a new plan (Admin only)
 * @param {object} planData
 * @returns {Promise<IPlanDoc>}
 */
const createPlan = async (planData) => {
    const plan = await plans_modal_1.default.create(planData);
    return plan;
};
exports.createPlan = createPlan;
/**
 * Update plan by ID (Admin only)
 * @param {string} planId
 * @param {object} updateData
 * @returns {Promise<IPlanDoc>}
 */
const updatePlan = async (planId, updateData) => {
    const plan = await (0, exports.getPlanById)(planId);
    Object.assign(plan, updateData);
    await plan.save();
    return plan;
};
exports.updatePlan = updatePlan;
/**
 * Delete plan by ID (Admin only)
 * @param {string} planId
 * @returns {Promise<void>}
 */
const deletePlan = async (planId) => {
    const plan = await (0, exports.getPlanById)(planId);
    await plan.deleteOne();
};
exports.deletePlan = deletePlan;

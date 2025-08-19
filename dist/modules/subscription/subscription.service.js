"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStripeCustomer = exports.syncUserWithStripe = exports.getUserStripeCustomerId = exports.handleWebhookEvent = exports.createCustomerPortalSession = exports.createSetupIntent = exports.getPaymentMethods = exports.updatePaymentMethod = exports.cancelSubscription = exports.updateSubscription = exports.getSubscriptionById = exports.getUserSubscriptionsandWorkspaces = exports.getActiveSubscriptionwithPlan = exports.getSubAdminModules = exports.getUserSubscription = exports.createSubscription = void 0;
const subscription_model_1 = __importDefault(require("./subscription.model"));
const plans_modal_1 = __importDefault(require("../plans/plans.modal"));
const user_model_1 = __importDefault(require("../user/user.model"));
const errors_1 = require("../errors");
const http_status_1 = __importDefault(require("http-status"));
const subscription_utils_1 = __importDefault(require("../utils/subscription.utils"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Create a new                                                                                                                                        subscription
 */
const createSubscription = async (data) => {
    const { userId, planId, priceId, paymentMethodId, billingCycle } = data;
    try {
        // Validate plan exists
        const plan = await plans_modal_1.default.findById(planId);
        if (!plan) {
            throw new errors_1.ApiError('Plan not found', http_status_1.default.NOT_FOUND);
        }
        // Check if user already has an active subscription
        const existingSubscription = await subscription_model_1.default.findOne({
            userId,
            planId,
            status: { $in: ['active', 'trialing'] },
        });
        if (existingSubscription) {
            throw new errors_1.ApiError('User already has an active subscription', http_status_1.default.BAD_REQUEST);
        }
        // Create Stripe customer if not exists (you'll need to implement this based on your user model)
        // For now, assuming stripeCustomerId is passed or retrieved from user
        const stripeCustomerId = await getOrCreateStripeCustomer(userId);
        // Attach payment method to customer
        await subscription_utils_1.default.attachPaymentMethod({
            paymentMethodId,
            customerId: stripeCustomerId,
        });
        // Create Stripe subscription
        const stripeSubscription = await subscription_utils_1.default.createSubscription({
            customerId: stripeCustomerId,
            priceId,
        });
        console.log('Stripe subscription created:', stripeSubscription);
        let invoice;
        if (stripeSubscription.latest_invoice && typeof stripeSubscription.latest_invoice !== 'string') {
            invoice = stripeSubscription.latest_invoice;
        }
        const endTimestamp = invoice?.lines?.data?.[0]?.period?.end;
        // Create local subscription record
        const subscription = await subscription_model_1.default.create({
            userId,
            planId,
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            status: stripeSubscription.status,
            billingCycle,
            currentPeriodStart: stripeSubscription.start_date
                ? new Date(stripeSubscription.start_date * 1000)
                : undefined,
            currentPeriodEnd: endTimestamp ? new Date(endTimestamp * 1000) : undefined,
            paymentMethodId,
            trialStart: stripeSubscription.trial_start
                ? new Date(stripeSubscription.trial_start * 1000)
                : undefined,
            trialEnd: stripeSubscription.trial_end
                ? new Date(stripeSubscription.trial_end * 1000)
                : undefined,
        });
        return subscription;
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
};
exports.createSubscription = createSubscription;
/**
 * Get user's subscription
 */
const getUserSubscription = async (userId) => {
    const subscription = await subscription_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
                status: { $in: ['active', 'trialing', 'past_due'] },
            },
        },
        {
            $lookup: {
                from: 'plans',
                localField: 'planId',
                foreignField: '_id',
                as: 'plan',
            },
        },
        {
            $unwind: {
                path: '$plan',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                planId: 1,
                status: 1,
                billingCycle: 1,
                currentPeriodStart: 1,
                currentPeriodEnd: 1,
                name: '$plan.name',
                category: '$plan.category',
                description: '$plan.description',
                features: '$plan.features'
            },
        },
    ]);
    return subscription;
};
exports.getUserSubscription = getUserSubscription;
const getSubAdminModules = async (modules) => {
    const subscription = await subscription_model_1.default.aggregate([
        {
            $match: {
                _id: { $in: modules.map(id => new mongoose_1.default.Types.ObjectId(id)) },
                status: { $in: ['active', 'trialing', 'past_due'] },
            },
        },
        {
            $lookup: {
                from: 'plans',
                localField: 'planId',
                foreignField: '_id',
                as: 'plan',
            },
        },
        {
            $unwind: {
                path: '$plan',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                planId: 1,
                status: 1,
                billingCycle: 1,
                currentPeriodStart: 1,
                currentPeriodEnd: 1,
                name: '$plan.name',
                category: '$plan.category',
                description: '$plan.description',
                features: '$plan.features'
            },
        },
    ]);
    return subscription;
};
exports.getSubAdminModules = getSubAdminModules;
const getActiveSubscriptionwithPlan = async (userId) => {
    const subscription = await subscription_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
                status: { $in: ['active', 'trialing', 'past_due'] },
            },
        },
        {
            $lookup: {
                from: 'plans',
                localField: 'planId',
                foreignField: '_id',
                as: 'plan',
            },
        },
        {
            $unwind: {
                path: '$plan',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                planId: 1,
                name: '$plan.name',
                category: '$plan.category',
                description: '$plan.description',
                features: '$plan.features',
                userLimit: "$plan.userLimit",
                workspaceLimit: "$plan.workspaceLimit",
                cloudStorage: "$plan.cloudStorage",
                certifications: "$plan.certifications",
                pricing: "$plan.pricing",
                subscription: {
                    id: "$_id",
                    status: "$status",
                    billingCycle: "$billingCycle",
                    currentPeriodStart: "$currentPeriodStart",
                    currentPeriodEnd: "$currentPeriodEnd",
                }
            },
        },
    ]);
    return subscription;
};
exports.getActiveSubscriptionwithPlan = getActiveSubscriptionwithPlan;
const getUserSubscriptionsandWorkspaces = async (userId) => {
    const subscription = await subscription_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
                status: { $in: ['active', 'trialing', 'past_due'] },
            },
        },
        {
            $lookup: {
                from: 'plans',
                localField: 'planId',
                foreignField: '_id',
                as: 'plan',
            },
        },
        {
            $unwind: {
                path: '$plan',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'capaworkspaces',
                let: { moduleId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$moduleId', '$$moduleId'] },
                                    { $eq: ['$isDeleted', false] },
                                ]
                            }
                        }
                    }
                ],
                as: 'workspaces'
            }
        },
        {
            $project: {
                _id: 1,
                status: 1,
                name: '$plan.name',
                workspaces: "$workspaces",
            },
        },
    ]);
    return subscription;
};
exports.getUserSubscriptionsandWorkspaces = getUserSubscriptionsandWorkspaces;
/**
 * Get subscription by ID
 */
const getSubscriptionById = async (subscriptionId) => {
    const subscription = await subscription_model_1.default.findById(subscriptionId);
    if (!subscription) {
        throw new errors_1.ApiError('Subscription not found', http_status_1.default.NOT_FOUND);
    }
    return subscription;
};
exports.getSubscriptionById = getSubscriptionById;
/**
 * Update subscription
 */
const updateSubscription = async (data) => {
    const { subscriptionId, newPriceId, newPaymentMethodId, cancelAtPeriodEnd } = data;
    try {
        const subscription = await (0, exports.getSubscriptionById)(subscriptionId);
        // Update Stripe subscription if needed
        if (newPriceId) {
            await subscription_utils_1.default.upgradeSubscription({
                subscriptionId: subscription.stripeSubscriptionId,
                newPriceId,
            });
            subscription.stripePriceId = newPriceId;
        }
        if (newPaymentMethodId) {
            await subscription_utils_1.default.updateSubscriptionPaymentMethod(subscription.stripeSubscriptionId, newPaymentMethodId);
            subscription.paymentMethodId = newPaymentMethodId;
        }
        if (cancelAtPeriodEnd !== undefined) {
            // Update Stripe subscription to cancel at period end
            if (cancelAtPeriodEnd) {
                await subscription_utils_1.default.cancelSubscription({
                    subscriptionId: subscription.stripeSubscriptionId,
                });
            }
            subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;
        }
        await subscription.save();
        return subscription;
    }
    catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
};
exports.updateSubscription = updateSubscription;
/**
 * Cancel subscription
 */
const cancelSubscription = async (subscriptionId) => {
    try {
        const subscription = await (0, exports.getSubscriptionById)(subscriptionId);
        // Cancel in Stripe
        await subscription_utils_1.default.cancelSubscription({
            subscriptionId: subscription.stripeSubscriptionId,
        });
        // Update local record
        subscription.status = 'canceled';
        subscription.canceledAt = new Date();
        subscription.cancelAtPeriodEnd = true;
        await subscription.save();
        return subscription;
    }
    catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
};
exports.cancelSubscription = cancelSubscription;
/**
 * Update payment method
 */
const updatePaymentMethod = async (data) => {
    const { customerId, paymentMethodId } = data;
    try {
        // Attach new payment method
        await subscription_utils_1.default.attachPaymentMethod({
            paymentMethodId,
            customerId,
        });
        // Update all active subscriptions for this customer
        const subscriptions = await subscription_model_1.default.find({
            stripeCustomerId: customerId,
            status: { $in: ['active', 'trialing'] },
        });
        for (const subscription of subscriptions) {
            await subscription_utils_1.default.updateSubscriptionPaymentMethod(subscription.stripeSubscriptionId, paymentMethodId);
            subscription.paymentMethodId = paymentMethodId;
            await subscription.save();
        }
    }
    catch (error) {
        console.error('Error updating payment method:', error);
        throw error;
    }
};
exports.updatePaymentMethod = updatePaymentMethod;
/**
 * Get customer's payment methods
 */
const getPaymentMethods = async (customerId) => {
    try {
        return await subscription_utils_1.default.getPaymentMethods(customerId);
    }
    catch (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
    }
};
exports.getPaymentMethods = getPaymentMethods;
/**
 * Create setup intent for saving payment method
 */
const createSetupIntent = async (customerId) => {
    try {
        return await subscription_utils_1.default.createSetupIntent(customerId);
    }
    catch (error) {
        console.error('Error creating setup intent:', error);
        throw error;
    }
};
exports.createSetupIntent = createSetupIntent;
/**
 * Create customer portal session
 */
const createCustomerPortalSession = async (customerId, returnUrl) => {
    try {
        return await subscription_utils_1.default.createCustomerPortalSession(customerId, returnUrl);
    }
    catch (error) {
        console.error('Error creating customer portal session:', error);
        throw error;
    }
};
exports.createCustomerPortalSession = createCustomerPortalSession;
/**
 * Handle Stripe webhook events
 */
const handleWebhookEvent = async (event) => {
    try {
        switch (event.type) {
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    catch (error) {
        console.error('Error handling webhook event:', error);
        throw error;
    }
};
exports.handleWebhookEvent = handleWebhookEvent;
// Helper functions
async function getOrCreateStripeCustomer(userId) {
    try {
        // Find the user by ID
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.ApiError('User not found', http_status_1.default.NOT_FOUND);
        }
        // If user already has a Stripe customer ID, return it
        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        }
        // Create a new Stripe customer using the utils
        const stripeCustomer = await subscription_utils_1.default.createCustomer({
            email: user.email,
            name: `${user.name}`,
            metadata: {
                userId: user._id.toString(),
                name: `${user.name}`
            },
            ...(user.contact && { phone: user.contact }), // Add phone if available
        });
        // Save the Stripe customer ID to the user record
        user.stripeCustomerId = stripeCustomer.id;
        await user.save();
        return stripeCustomer.id;
    }
    catch (error) {
        console.error('Error creating/retrieving Stripe customer:', error);
        if (error instanceof errors_1.ApiError) {
            throw error;
        }
        throw new errors_1.ApiError('Failed to create Stripe customer', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
}
async function handleSubscriptionUpdated(subscription) {
    const localSubscription = await subscription_model_1.default.findOne({
        stripeSubscriptionId: subscription.id,
    });
    if (localSubscription) {
        localSubscription.status = subscription.status;
        await localSubscription.save();
    }
}
async function handleSubscriptionDeleted(subscription) {
    const localSubscription = await subscription_model_1.default.findOne({
        stripeSubscriptionId: subscription.id,
    });
    if (localSubscription) {
        localSubscription.status = 'canceled';
        localSubscription.canceledAt = new Date();
        await localSubscription.save();
    }
}
async function handlePaymentSucceeded(invoice) {
    if (invoice.subscription) {
        const localSubscription = await subscription_model_1.default.findOne({
            stripeSubscriptionId: invoice.subscription,
        });
        if (localSubscription) {
            localSubscription.lastPaymentDate = new Date();
            localSubscription.nextPaymentDate = new Date(invoice.next_payment_attempt * 1000);
            await localSubscription.save();
        }
    }
}
async function handlePaymentFailed(invoice) {
    if (invoice.subscription) {
        const localSubscription = await subscription_model_1.default.findOne({
            stripeSubscriptionId: invoice.subscription,
        });
        if (localSubscription) {
            localSubscription.status = 'past_due';
            await localSubscription.save();
        }
    }
}
/**
 * Get user's Stripe customer ID
 */
const getUserStripeCustomerId = async (userId) => {
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.ApiError('User not found', http_status_1.default.NOT_FOUND);
        }
        if (!user.stripeCustomerId) {
            // If user doesn't have a Stripe customer ID, create one
            return await getOrCreateStripeCustomer(userId);
        }
        return user.stripeCustomerId;
    }
    catch (error) {
        console.error('Error getting user Stripe customer ID:', error);
        if (error instanceof errors_1.ApiError) {
            throw error;
        }
        throw new errors_1.ApiError('Failed to get Stripe customer ID', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.getUserStripeCustomerId = getUserStripeCustomerId;
/**
 * Sync existing user with Stripe customer (for users who don't have stripeCustomerId)
 */
const syncUserWithStripe = async (userId) => {
    return await getOrCreateStripeCustomer(userId);
};
exports.syncUserWithStripe = syncUserWithStripe;
/**
 * Update Stripe customer information
 */
const updateStripeCustomer = async (userId, updateData) => {
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new errors_1.ApiError('User not found', http_status_1.default.NOT_FOUND);
        }
        const stripeCustomerId = await (0, exports.getUserStripeCustomerId)(userId);
        await subscription_utils_1.default.updateCustomer(stripeCustomerId, updateData);
    }
    catch (error) {
        console.error('Error updating Stripe customer:', error);
        if (error instanceof errors_1.ApiError) {
            throw error;
        }
        throw new errors_1.ApiError('Failed to update Stripe customer', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.updateStripeCustomer = updateStripeCustomer;

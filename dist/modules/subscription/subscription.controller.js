"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCustomerPortalSession = exports.createSetupIntent = exports.getPaymentMethods = exports.updatePaymentMethod = exports.cancelSubscription = exports.updateSubscription = exports.getmodulesNameAndWorkspaces = exports.getActiveSubscription = exports.getCurrentSubscription = exports.createSubscription = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const subscriptionService = __importStar(require("./subscription.service"));
/**
 * Helper to get the effective user ID (handles subAdmin case)
 */
function getEffectiveUserId(req) {
    if (req.user?.role === 'subAdmin') {
        return req.user?.createdBy?.toString();
    }
    return req.user?.id;
}
/**
 * Create subscription
 */
exports.createSubscription = (0, utils_1.catchAsync)(async (req, res) => {
    const { planId, priceId, paymentMethodId, billingCycle } = req.body;
    if (req.user.role !== 'admin') {
        res.status(http_status_1.default.FORBIDDEN).json({
            success: false,
            message: 'Only admin can create subscriptions',
        });
        return;
    }
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const subscription = await subscriptionService.createSubscription({
        userId,
        planId,
        priceId,
        paymentMethodId,
        billingCycle,
    });
    res.status(http_status_1.default.CREATED).json({
        success: true,
        data: subscription,
        message: 'Subscription created successfully',
    });
});
/**
 * Get user's current subscription
 */
exports.getCurrentSubscription = (0, utils_1.catchAsync)(async (req, res) => {
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const subscription = await subscriptionService.getUserSubscription(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: subscription,
    });
});
exports.getActiveSubscription = (0, utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    let subscription;
    console.log('User role:', req.user.role);
    if (req.user.role === 'subAdmin') {
        const modules = req.user.adminOF || [];
        const getModules = modules?.map((module) => module.method?.toString());
        subscription = await subscriptionService.getSubAdminModules(getModules);
    }
    else {
        subscription = await subscriptionService.getActiveSubscriptionwithPlan(userId);
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        data: subscription,
    });
});
exports.getmodulesNameAndWorkspaces = (0, utils_1.catchAsync)(async (req, res) => {
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const modules = await subscriptionService.getUserSubscriptionsandWorkspaces(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: modules,
    });
});
/**
 * Update subscription
 */
exports.updateSubscription = (0, utils_1.catchAsync)(async (req, res) => {
    const { subscriptionId } = req.params;
    const { newPriceId, newPaymentMethodId, cancelAtPeriodEnd } = req.body;
    if (!subscriptionId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Subscription ID is required',
        });
        return;
    }
    const subscription = await subscriptionService.updateSubscription({
        subscriptionId,
        newPriceId,
        newPaymentMethodId,
        cancelAtPeriodEnd,
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        data: subscription,
        message: 'Subscription updated successfully',
    });
});
/**
 * Cancel subscription
 */
exports.cancelSubscription = (0, utils_1.catchAsync)(async (req, res) => {
    const { subscriptionId } = req.params;
    if (!subscriptionId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Subscription ID is required',
        });
        return;
    }
    const subscription = await subscriptionService.cancelSubscription(subscriptionId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: subscription,
        message: 'Subscription canceled successfully',
    });
});
exports.updatePaymentMethod = (0, utils_1.catchAsync)(async (req, res) => {
    const { paymentMethodId } = req.body;
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const customerId = await getUserStripeCustomerId(userId);
    await subscriptionService.updatePaymentMethod({
        customerId,
        paymentMethodId,
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Payment method updated successfully',
    });
});
/**
 * Get payment methods
 */
exports.getPaymentMethods = (0, utils_1.catchAsync)(async (req, res) => {
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const customerId = await getUserStripeCustomerId(userId);
    const paymentMethods = await subscriptionService.getPaymentMethods(customerId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: paymentMethods,
    });
});
/**
 * Create setup intent for adding payment method
 */
exports.createSetupIntent = (0, utils_1.catchAsync)(async (req, res) => {
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const customerId = await getUserStripeCustomerId(userId);
    const setupIntent = await subscriptionService.createSetupIntent(customerId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: setupIntent,
    });
});
/**
 * Create customer portal session
 */
exports.createCustomerPortalSession = (0, utils_1.catchAsync)(async (req, res) => {
    const { returnUrl } = req.body;
    const userId = getEffectiveUserId(req);
    if (!userId) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'User not authenticated',
        });
        return;
    }
    const customerId = await getUserStripeCustomerId(userId);
    const session = await subscriptionService.createCustomerPortalSession(customerId, returnUrl);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: session,
    });
});
/**
 * Handle Stripe webhook
 */
exports.handleWebhook = (0, utils_1.catchAsync)(async (req, res) => {
    const event = req.body;
    try {
        await subscriptionService.handleWebhookEvent(event);
        res.status(http_status_1.default.OK).json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Webhook error',
        });
    }
});
// Helper function - you'll need to implement this based on your user model
async function getUserStripeCustomerId(userId) {
    // Use the service function
    return await subscriptionService.getUserStripeCustomerId(userId);
}

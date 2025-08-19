"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCustomerPortalSession = exports.createSetupIntent = exports.updatePaymentMethod = exports.resumeSubscription = exports.pauseSubscription = exports.cancelSubscription = exports.getSubscription = exports.updateSubscription = exports.createSubscription = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation for creating a subscription
exports.createSubscription = {
    body: joi_1.default.object().keys({
        planId: joi_1.default.string().required(),
        priceId: joi_1.default.string().required(),
        paymentMethodId: joi_1.default.string().required(),
        billingCycle: joi_1.default.string().valid('monthly', 'yearly').required(),
    }),
};
// Validation for updating a subscription
exports.updateSubscription = {
    params: joi_1.default.object().keys({
        subscriptionId: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        newPriceId: joi_1.default.string(),
        newPaymentMethodId: joi_1.default.string(),
        cancelAtPeriodEnd: joi_1.default.boolean(),
    }).min(1),
};
// Validation for getting subscription by ID
exports.getSubscription = {
    params: joi_1.default.object().keys({
        subscriptionId: joi_1.default.string().required(),
    }),
};
// Validation for canceling subscription
exports.cancelSubscription = {
    params: joi_1.default.object().keys({
        subscriptionId: joi_1.default.string().required(),
    }),
};
// Validation for pausing subscription
exports.pauseSubscription = {
    params: joi_1.default.object().keys({
        subscriptionId: joi_1.default.string().required(),
    }),
};
// Validation for resuming subscription
exports.resumeSubscription = {
    params: joi_1.default.object().keys({
        subscriptionId: joi_1.default.string().required(),
    }),
};
// Validation for updating payment method
exports.updatePaymentMethod = {
    body: joi_1.default.object().keys({
        paymentMethodId: joi_1.default.string().required(),
    }),
};
// Validation for creating setup intent
exports.createSetupIntent = {
    body: joi_1.default.object().keys({
        returnUrl: joi_1.default.string().uri(),
    }),
};
// Validation for creating customer portal session
exports.createCustomerPortalSession = {
    body: joi_1.default.object().keys({
        returnUrl: joi_1.default.string().uri().required(),
    }),
};
// Validation for webhook events
exports.handleWebhook = {
    body: joi_1.default.object().keys({
        type: joi_1.default.string().required(),
        data: joi_1.default.object().required(),
        id: joi_1.default.string().required(),
        created: joi_1.default.number().required(),
    }),
};

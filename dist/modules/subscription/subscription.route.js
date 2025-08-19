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
exports.webhookRouter = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../auth");
const validate_1 = require("../validate");
const subscriptionValidation = __importStar(require("./subscription.validation"));
const subscriptionController = __importStar(require("./subscription.controller"));
const router = express_1.default.Router();
exports.router = router;
// Apply authentication to all routes
// Subscription management routes
router
    .route('/')
    .post((0, validate_1.validate)(subscriptionValidation.createSubscription), (0, auth_1.auth)('buySubscription'), subscriptionController.createSubscription)
    .get((0, auth_1.auth)('getSubscriptions'), subscriptionController.getActiveSubscription);
router.get('/names', (0, auth_1.auth)('getSubscriptions'), subscriptionController.getmodulesNameAndWorkspaces);
router
    .route('/:subscriptionId')
    .patch((0, validate_1.validate)(subscriptionValidation.updateSubscription), subscriptionController.updateSubscription);
// Subscription actions
router.post('/:subscriptionId/cancel', (0, validate_1.validate)(subscriptionValidation.cancelSubscription), subscriptionController.cancelSubscription);
// Payment method management
router
    .route('/payment-methods')
    .get(subscriptionController.getPaymentMethods)
    .patch((0, validate_1.validate)(subscriptionValidation.updatePaymentMethod), subscriptionController.updatePaymentMethod);
// Setup intent for adding new payment methods
router.post('/setup-intent', (0, validate_1.validate)(subscriptionValidation.createSetupIntent), subscriptionController.createSetupIntent);
// Customer portal session
router.post('/customer-portal', (0, validate_1.validate)(subscriptionValidation.createCustomerPortalSession), subscriptionController.createCustomerPortalSession);
// Webhook endpoint (this should be public, so we'll create a separate route)
const webhookRouter = express_1.default.Router();
exports.webhookRouter = webhookRouter;
webhookRouter.post('/webhook', express_1.default.raw({ type: 'application/json' }), // Stripe requires raw body
(0, validate_1.validate)(subscriptionValidation.handleWebhook), subscriptionController.handleWebhook);
exports.default = router;

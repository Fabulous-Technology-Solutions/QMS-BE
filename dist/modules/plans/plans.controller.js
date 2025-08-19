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
exports.deletePlan = exports.updatePlan = exports.createPlan = exports.calculatePricing = exports.getPlanComparison = exports.getPlanById = exports.getPlanBySlug = exports.getPopularPlans = exports.getPlans = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const planService = __importStar(require("./plans.service"));
/**
 * Get all plans
 */
exports.getPlans = (0, catchAsync_1.default)(async (req, res) => {
    const { category } = req.query;
    let plans;
    if (category) {
        plans = await planService.getPlansByCategory(category);
    }
    else {
        // req.headers.authorization;
        plans = await planService.getAllPlans(req.user);
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        data: plans,
    });
});
/**
 * Get popular plans
 */
exports.getPopularPlans = (0, catchAsync_1.default)(async (_req, res) => {
    const plans = await planService.getPopularPlans();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: plans,
    });
});
/**
 * Get plan by slug
 */
exports.getPlanBySlug = (0, catchAsync_1.default)(async (req, res) => {
    const { slug } = req.params;
    const plan = await planService.getPlanBySlug(slug);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: plan,
    });
});
/**
 * Get plan by ID
 */
exports.getPlanById = (0, catchAsync_1.default)(async (req, res) => {
    const { planId } = req.params;
    const plan = await planService.getPlanById(planId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: plan,
    });
});
/**
 * Get plan comparison
 */
exports.getPlanComparison = (0, catchAsync_1.default)(async (_req, res) => {
    const comparison = await planService.getPlanComparison();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: comparison,
    });
});
/**
 * Calculate plan pricing
 */
exports.calculatePricing = (0, catchAsync_1.default)(async (req, res) => {
    const { planId } = req.params;
    const { billingCycle = 'monthly' } = req.body;
    const plan = await planService.getPlanById(planId);
    const pricing = planService.calculatePricing(plan, billingCycle);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: pricing,
    });
});
/**
 * Create plan (Admin only)
 */
exports.createPlan = (0, catchAsync_1.default)(async (req, res) => {
    const plan = await planService.createPlan(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        data: plan,
        message: 'Plan created successfully',
    });
});
/**
 * Update plan (Admin only)
 */
exports.updatePlan = (0, catchAsync_1.default)(async (req, res) => {
    const { planId } = req.params;
    const plan = await planService.updatePlan(planId, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: plan,
        message: 'Plan updated successfully',
    });
});
/**
 * Delete plan (Admin only)
 */
exports.deletePlan = (0, catchAsync_1.default)(async (req, res) => {
    const { planId } = req.params;
    await planService.deletePlan(planId);
    res.status(http_status_1.default.NO_CONTENT).json({
        success: true,
        message: 'Plan deleted successfully',
    });
});

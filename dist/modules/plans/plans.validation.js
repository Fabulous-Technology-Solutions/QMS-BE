"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePricing = exports.getPlans = exports.getPlanBySlug = exports.getPlanById = exports.updatePlan = exports.createPlan = void 0;
const joi_1 = __importDefault(require("joi"));
const planFeature = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    included: joi_1.default.boolean().default(true),
});
const pricingTier = joi_1.default.object({
    monthly: joi_1.default.number().min(0).required(),
    yearly: joi_1.default.number().min(0).required(),
    currency: joi_1.default.string().default('USD').uppercase(),
});
exports.createPlan = {
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        category: joi_1.default.string().valid('document-control', 'audit-management', 'capa-management', 'risk-management').required(),
        pricing: pricingTier.required(),
        features: joi_1.default.array().items(planFeature).default([]),
        userLimit: joi_1.default.number().min(1).default(10),
        workspaceLimit: joi_1.default.number().min(1).default(1),
        cloudStorage: joi_1.default.number().min(1).default(100),
        emailBoarding: joi_1.default.boolean().default(true),
        certifications: joi_1.default.array().items(joi_1.default.string()).default([]),
        isActive: joi_1.default.boolean().default(true),
        isPopular: joi_1.default.boolean().default(false),
    }),
};
exports.updatePlan = {
    params: joi_1.default.object({
        planId: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        name: joi_1.default.string(),
        description: joi_1.default.string(),
        category: joi_1.default.string().valid('document-control', 'audit-management', 'capa-management', 'risk-management'),
        pricing: pricingTier,
        features: joi_1.default.array().items(planFeature),
        userLimit: joi_1.default.number().min(1),
        workspaceLimit: joi_1.default.number().min(1),
        cloudStorage: joi_1.default.number().min(1),
        emailBoarding: joi_1.default.boolean(),
        certifications: joi_1.default.array().items(joi_1.default.string()),
        isActive: joi_1.default.boolean(),
        isPopular: joi_1.default.boolean(),
    }).min(1),
};
exports.getPlanById = {
    params: joi_1.default.object({
        planId: joi_1.default.string().required(),
    }),
};
exports.getPlanBySlug = {
    params: joi_1.default.object({
        slug: joi_1.default.string().required(),
    }),
};
exports.getPlans = {
    query: joi_1.default.object({
        category: joi_1.default.string().valid('document-control', 'audit-management', 'capa-management', 'risk-management'),
        page: joi_1.default.number().min(1).default(1),
        limit: joi_1.default.number().min(1).max(100).default(10),
        sortBy: joi_1.default.string().default('pricing.monthly:asc'),
    }),
};
exports.calculatePricing = {
    params: joi_1.default.object({
        planId: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        billingCycle: joi_1.default.string().valid('monthly', 'yearly').default('monthly'),
    }),
};

import Joi from 'joi';

const planFeature = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  included: Joi.boolean().default(true),
});

const pricingTier = Joi.object({
  monthly: Joi.number().min(0).required(),
  yearly: Joi.number().min(0).required(),
  currency: Joi.string().default('USD').uppercase(),
});

export const createPlan = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().valid('document-control', 'audit-management', 'capa-management', 'risk-management').required(),
    pricing: pricingTier.required(),
    features: Joi.array().items(planFeature).default([]),
    userLimit: Joi.number().min(1).default(10),
    workspaceLimit: Joi.number().min(1).default(1),
    cloudStorage: Joi.number().min(1).default(100),
    emailBoarding: Joi.boolean().default(true),
    certifications: Joi.array().items(Joi.string()).default([]),
    isActive: Joi.boolean().default(true),
    isPopular: Joi.boolean().default(false),
  }),
};

export const updatePlan = {
  params: Joi.object({
    planId: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string().valid('document-control', 'audit-management', 'capa-management', 'risk-management'),
    pricing: pricingTier,
    features: Joi.array().items(planFeature),
    userLimit: Joi.number().min(1),
    workspaceLimit: Joi.number().min(1),
    cloudStorage: Joi.number().min(1),
    emailBoarding: Joi.boolean(),
    certifications: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
    isPopular: Joi.boolean(),
  }).min(1),
};

export const getPlanById = {
  params: Joi.object({
    planId: Joi.string().required(),
  }),
};

export const getPlanBySlug = {
  params: Joi.object({
    slug: Joi.string().required(),
  }),
};

export const getPlans = {
  query: Joi.object({
    category: Joi.string().valid('document-control', 'audit-management', 'capa-management', 'risk-management'),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().default('pricing.monthly:asc'),
  }),
};

export const calculatePricing = {
  params: Joi.object({
    planId: Joi.string().required(),
  }),
  body: Joi.object({
    billingCycle: Joi.string().valid('monthly', 'yearly').default('monthly'),
  }),
};

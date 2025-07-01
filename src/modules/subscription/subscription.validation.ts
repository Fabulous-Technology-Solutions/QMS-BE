import Joi from 'joi';

// Validation for creating a subscription
export const createSubscription = {
  body: Joi.object().keys({
    planId: Joi.string().required(),
    priceId: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
    billingCycle: Joi.string().valid('monthly', 'yearly').required(),
  }),
};

// Validation for updating a subscription
export const updateSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    newPriceId: Joi.string(),
    newPaymentMethodId: Joi.string(),
    cancelAtPeriodEnd: Joi.boolean(),
  }).min(1),
};

// Validation for getting subscription by ID
export const getSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
};

// Validation for canceling subscription
export const cancelSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
};

// Validation for pausing subscription
export const pauseSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
};

// Validation for resuming subscription
export const resumeSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().required(),
  }),
};

// Validation for updating payment method
export const updatePaymentMethod = {
  body: Joi.object().keys({
    paymentMethodId: Joi.string().required(),
  }),
};

// Validation for creating setup intent
export const createSetupIntent = {
  body: Joi.object().keys({
    returnUrl: Joi.string().uri(),
  }),
};

// Validation for creating customer portal session
export const createCustomerPortalSession = {
  body: Joi.object().keys({
    returnUrl: Joi.string().uri().required(),
  }),
};

// Validation for webhook events
export const handleWebhook = {
  body: Joi.object().keys({
    type: Joi.string().required(),
    data: Joi.object().required(),
    id: Joi.string().required(),
    created: Joi.number().required(),
  }),
};

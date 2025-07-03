import express from 'express';
import { auth } from '../auth';
import { validate } from '../validate';
import * as subscriptionValidation from './subscription.validation';
import * as subscriptionController from './subscription.controller';

const router = express.Router();

// Apply authentication to all routes
router.use(auth('buySubscription'));

// Subscription management routes
router
  .route('/')
  .post(
    validate(subscriptionValidation.createSubscription),
    subscriptionController.createSubscription
  )
  .get(subscriptionController.getCurrentSubscription);

router
  .route('/:subscriptionId')
  .get(
    validate(subscriptionValidation.getSubscription),
    subscriptionController.getSubscriptionById
  )
  .patch(
    validate(subscriptionValidation.updateSubscription),
    subscriptionController.updateSubscription
  );

// Subscription actions
router.post(
  '/:subscriptionId/cancel',
  validate(subscriptionValidation.cancelSubscription),
  subscriptionController.cancelSubscription
);

router.post(
  '/:subscriptionId/pause',
  validate(subscriptionValidation.pauseSubscription),
  subscriptionController.pauseSubscription
);

router.post(
  '/:subscriptionId/resume',
  validate(subscriptionValidation.resumeSubscription),
  subscriptionController.resumeSubscription
);

// Payment method management
router
  .route('/payment-methods')
  .get(subscriptionController.getPaymentMethods)
  .patch(
    validate(subscriptionValidation.updatePaymentMethod),
    subscriptionController.updatePaymentMethod
  );

// Setup intent for adding new payment methods
router.post(
  '/setup-intent',
  validate(subscriptionValidation.createSetupIntent),
  subscriptionController.createSetupIntent
);

// Customer portal session
router.post(
  '/customer-portal',
  validate(subscriptionValidation.createCustomerPortalSession),
  subscriptionController.createCustomerPortalSession
);

// Webhook endpoint (this should be public, so we'll create a separate route)
const webhookRouter = express.Router();

webhookRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Stripe requires raw body
  validate(subscriptionValidation.handleWebhook),
  subscriptionController.handleWebhook
);

export { router, webhookRouter };
export default router;

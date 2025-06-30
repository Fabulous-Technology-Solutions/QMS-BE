import express from 'express';
import * as planController from './plans.controller';
import * as planValidation from './plans.validation';
import { validate } from '../validate';
import { auth } from '../auth';

const router = express.Router();

// Public routes
router
  .route('/')
  .get(validate(planValidation.getPlans), planController.getPlans)
  .post(auth('managePlans'), validate(planValidation.createPlan), planController.createPlan);

router
  .route('/popular')
  .get(planController.getPopularPlans);

router
  .route('/comparison')
  .get(planController.getPlanComparison);

router
  .route('/slug/:slug')
  .get(validate(planValidation.getPlanBySlug), planController.getPlanBySlug);

router
  .route('/:planId')
  .get(validate(planValidation.getPlanById), planController.getPlanById)
  .patch(auth('managePlans'), validate(planValidation.updatePlan), planController.updatePlan)
  .delete(auth('managePlans'), validate(planValidation.getPlanById), planController.deletePlan);

router
  .route('/:planId/pricing')
  .post(validate(planValidation.calculatePricing), planController.calculatePricing);

export default router;

import express, { NextFunction, Request, Response } from 'express';
import * as planController from './plans.controller';
import * as planValidation from './plans.validation';
import { validate } from '../validate';
import { auth } from '../auth';

const router = express.Router();
const optionalAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      console.log("Authorization header:", req.headers.authorization);
      return auth()(req, res, next); // Run auth middleware manually
    }
    return next();
  };
};

// Public routes
router
  .route('/')
  .get(
    validate(planValidation.getPlans),
   optionalAuth(),
    planController.getPlans
  )
  .post(
    auth('managePlans'),
    validate(planValidation.createPlan),
    planController.createPlan
  );


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

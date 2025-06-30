import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as planService from './plans.service';

/**
 * Get all plans
 */
export const getPlans = catchAsync(async (req: Request, res: Response) => {
  const { category } = req.query;
  
  let plans;
  if (category) {
    plans = await planService.getPlansByCategory(category as string);
  } else {
    plans = await planService.getAllPlans();
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: plans,
  });
});

/**
 * Get popular plans
 */
export const getPopularPlans = catchAsync(async (_req: Request, res: Response) => {
  const plans = await planService.getPopularPlans();
  
  res.status(httpStatus.OK).json({
    success: true,
    data: plans,
  });
});

/**
 * Get plan by slug
 */
export const getPlanBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const plan = await planService.getPlanBySlug(slug!);
  
  res.status(httpStatus.OK).json({
    success: true,
    data: plan,
  });
});

/**
 * Get plan by ID
 */
export const getPlanById = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const plan = await planService.getPlanById(planId!);
  
  res.status(httpStatus.OK).json({
    success: true,
    data: plan,
  });
});

/**
 * Get plan comparison
 */
export const getPlanComparison = catchAsync(async (_req: Request, res: Response) => {
  const comparison = await planService.getPlanComparison();
  
  res.status(httpStatus.OK).json({
    success: true,
    data: comparison,
  });
});

/**
 * Calculate plan pricing
 */
export const calculatePricing = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { billingCycle = 'monthly' } = req.body;
  
  const plan = await planService.getPlanById(planId!);
  const pricing = planService.calculatePricing(plan, billingCycle);
  
  res.status(httpStatus.OK).json({
    success: true,
    data: pricing,
  });
});

/**
 * Create plan (Admin only)
 */
export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await planService.createPlan(req.body);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    data: plan,
    message: 'Plan created successfully',
  });
});

/**
 * Update plan (Admin only)
 */
export const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const plan = await planService.updatePlan(planId!, req.body);
  
  res.status(httpStatus.OK).json({
    success: true,
    data: plan,
    message: 'Plan updated successfully',
  });
});

/**
 * Delete plan (Admin only)
 */
export const deletePlan = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.params;
  await planService.deletePlan(planId!);
  
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Plan deleted successfully',
  });
});

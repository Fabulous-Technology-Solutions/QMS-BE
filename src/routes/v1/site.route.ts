import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { siteController, SiteValidation } from '../../modules/businessManagement/sites';
import { activityLoggerMiddleware } from '../../modules/activitylogs/activitylogs.middleware';
const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageSites'), validate(SiteValidation.createSiteSchema), activityLoggerMiddleware, siteController.createSite)
  .get(auth('manageSites'), siteController.getAllSites);

router
  .route('/:id')
  .get(auth('manageSites'), siteController.getSite)
  .patch(auth('manageSites'), validate(SiteValidation.updateSiteSchema), activityLoggerMiddleware, siteController.updateSite)
  .delete(auth('manageSites'), activityLoggerMiddleware, siteController.deleteSite);

router.get("/names/:moduleId", siteController.getSiteNamesByModule);

export default router;

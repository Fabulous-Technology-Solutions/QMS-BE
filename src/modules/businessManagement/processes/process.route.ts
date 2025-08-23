import express, { Router } from 'express';
import { validate } from '../../validate';
import { auth } from '../../auth';
import * as processController from './process.controller';
import { createProcessSchema, updateProcessSchema } from './process.validation';
import { activityLoggerMiddleware } from '../../activitylogs/activitylogs.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth('manageProcesses'), 
    validate(createProcessSchema), 
    activityLoggerMiddleware, 
    processController.createProcess
  )
  .get(auth('manageProcesses'), processController.getAllProcesses);

router
  .route('/:id')
  .get(auth('manageProcesses'), processController.getProcess)
  .patch(
    auth('manageProcesses'), 
    validate(updateProcessSchema), 
    activityLoggerMiddleware, 
    processController.updateProcess
  )
  .delete(
    auth('manageProcesses'), 
    activityLoggerMiddleware, 
    processController.deleteProcess
  );

router.get(
  "/names/:moduleId", 
  auth('manageProcesses'),
  processController.getProcessNamesByModule
);

router.get(
  "/module/:moduleId", 
  auth('manageProcesses'),
  processController.getProcessesByModule
);

router.get(
  "/site/:siteId", 
  auth('manageProcesses'),
  processController.getProcessesBySite
);

export default router;

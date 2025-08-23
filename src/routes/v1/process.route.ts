import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { processController, ProcessValidation } from '../../modules/businessManagement/processes';
import { activityLoggerMiddleware } from '../../modules/activitylogs/activitylogs.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth('manageProcesses'), 
    validate(ProcessValidation.createProcessSchema), 
    activityLoggerMiddleware, 
    processController.createProcess
  )
  .get(auth('manageProcesses'), processController.getAllProcesses);

router
  .route('/:id')
  .get(auth('manageProcesses'), processController.getProcess)
  .patch(
    auth('manageProcesses'), 
    validate(ProcessValidation.updateProcessSchema), 
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

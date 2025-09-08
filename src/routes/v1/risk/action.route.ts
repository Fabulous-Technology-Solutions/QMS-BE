import express, { Router } from 'express';
import {  ActionController, ActionValidation } from '../../../modules/risk/workspace/library/action';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('risk_createAction'),
  checkValidation,
  validate(ActionValidation.createAction),
  activityLoggerMiddleware,
  ActionController.createActionController
);
router.get("/tasks", auth("risk_getTasks"),ActionController.getTasksByUserController);
router.get('/libraries/:libraryId', auth('risk_getActions'), checkValidation, ActionController.getActionsByLibraryController);
router.get('/libraries/:libraryId/action/:actionId', auth('risk_getSingleAction'), checkValidation, ActionController.getActionByIdController);
router.patch('/libraries/:libraryId/action/:actionId', auth('risk_updateAction'), checkValidation, activityLoggerMiddleware, ActionController.updateActionController);
router.delete('/libraries/:libraryId/action/:actionId',  auth('risk_deleteAction'), checkValidation, activityLoggerMiddleware, ActionController.deleteActionController);

  
export default router;
       
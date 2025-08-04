import express, { Router } from 'express';
import {  ActionController, ActionValidation } from '../../modules/capa/workspace/capalibrary/action';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkValidation from '../../modules/capa/workspace/capalibrary/capalibrary.middleware';
import { activityLoggerMiddleware } from '../../modules/activitylogs/activitylogs.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createAction'),
  checkValidation,
  validate(ActionValidation.createAction),
  activityLoggerMiddleware ,
  ActionController.createActionController
);
router.get("/tasks", auth("getTasks"),ActionController.getTasksByUserController);
router.get('/libraries/:libraryId', auth('getActions'), checkValidation, ActionController.getActionsByLibraryController);
router.get('/libraries/:libraryId/action/:actionId', auth('getSingleAction'), checkValidation, ActionController.getActionByIdController);
router.patch('/libraries/:libraryId/action/:actionId', activityLoggerMiddleware, auth('updateAction'), checkValidation, ActionController.updateActionController);
router.delete('/libraries/:libraryId/action/:actionId', activityLoggerMiddleware, auth('deleteAction'), checkValidation, ActionController.deleteActionController);


export default router;
       
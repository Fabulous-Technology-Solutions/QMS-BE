import express, { Router } from 'express';
import {  ActionController, ActionValidation } from '../../modules/capa/workspace/capalibrary/action';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkValidation from '../../modules/capa/workspace/capalibrary/capalibrary.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createAction'),
  checkValidation,
  validate(ActionValidation.createAction),
  ActionController.createActionController
);
router.get("/tasks", auth("getTasks"), ActionController.getTasksByUserController);
router.get('/libraries/:libraryId', auth('getActions'), checkValidation, ActionController.getActionsByLibraryController);
router.get('/libraries/:libraryId/action/:actionId', auth('getSingleAction'), checkValidation, ActionController.getActionByIdController);
router.patch('/libraries/:libraryId/action/:actionId', auth('updateAction'), checkValidation, ActionController.updateActionController);
router.delete('/libraries/:libraryId/action/:actionId', auth('deleteAction'), checkValidation, ActionController.deleteActionController);

export default router;
       
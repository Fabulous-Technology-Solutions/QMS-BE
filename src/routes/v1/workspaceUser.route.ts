import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';

import { workspaceUserController, workspaceUserValidation } from '../../modules/capa/workspace/workspaceUser';
import checkCreateRole from '../../modules/capa/workspace/mangeRole.middleware';

const router: Router = express.Router();
router
  .route('/')
  .post(auth('createWorkspaceUser'), validate(workspaceUserValidation.createWorkspaceUser), checkCreateRole, workspaceUserController.createWorkspaceUserController)

router.route('/:workspaceId').get(auth('getWorkspaceUsers'), checkCreateRole, workspaceUserController.getWorkspaceUsersController);
router
  .route('/:workspaceId/names')
  .get(auth('getWorkspaceUsers'), checkCreateRole, workspaceUserController.getworkspacegroupsNamesController);
router
  .route('/:workspaceId/:userId')
  .patch(auth('updateWorkspaceUser'), checkCreateRole, workspaceUserController.updateWorkspaceUserController)
  .get(auth('getSingleWorkspaceUser'), checkCreateRole, workspaceUserController.getSingleWorkspaceUserController)
  .delete(auth('deleteWorkspaceUser'), checkCreateRole, workspaceUserController.deleteWorkspaceUserController);


export default router;
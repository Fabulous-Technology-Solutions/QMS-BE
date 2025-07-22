import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';

import { workspaceUserController, workspaceUserValidation } from '../../modules/capa/workspaceUser';
import checkCreateRole from '@/modules/capa/workspace/manageRole/mangeRole.middleware';

const router: Router = express.Router();
router
  .route('/')
  .post(auth('manageWorkspaceUsers'), validate(workspaceUserValidation.createWorkspaceUser), checkCreateRole,workspaceUserController.createWorkspaceUserController)
  

router.route('/:workspaceId').get(auth('manageWorkspaceUsers'), workspaceUserController.getWorkspaceUsersController);
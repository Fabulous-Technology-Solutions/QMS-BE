import express, { Router } from 'express';
import { RoleController, RoleValidation } from '../../modules/capa/workspace/manageRole';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkCreateRole from './../../modules/capa/workspace/manageRole/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('manageRole'),
  checkCreateRole,
  validate(RoleValidation.createRole),
  RoleController.createRoleController
); 
router.get('/workspace/:workspaceId', auth('manageRole'),  checkCreateRole, RoleController.getWorkspaceRolesController);
router.get('/workspace/:workspaceId/names', auth('manageRole'),  checkCreateRole, RoleController.getWorkspaceRoleNamesController);


router.get('/:workspaceId/:roleId', auth('manageRole'), checkCreateRole,RoleController.getRoleByIdController);

router.patch('/:workspaceId/:roleId', auth('manageRole'), checkCreateRole, validate(RoleValidation.updateRole), RoleController.updateRoleController);

router.delete('/:workspaceId/:roleId', auth('manageRole'), checkCreateRole,RoleController.deleteRoleController);

export default router;
       
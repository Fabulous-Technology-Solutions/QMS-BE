import express, { Router } from 'express';
import { RoleController, RoleValidation } from '../../../modules/capa/workspace/manageRole';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/workspace/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createRole'),
  checkCreateRole,
  validate(RoleValidation.createRole),                                                                                    
  RoleController.createRoleController
); 
router.get('/workspace/:workspaceId', auth('createRole'),  checkCreateRole, RoleController.getWorkspaceRolesController);
router.get('/workspace/:workspaceId/names', auth('getWorkspaceRoleNames'),  checkCreateRole, RoleController.getWorkspaceRoleNamesController);


router.get('/:workspaceId/:roleId', auth('getSingleRole'), checkCreateRole,RoleController.getRoleByIdController);

router.patch('/:workspaceId/:roleId', auth('updateRole'), checkCreateRole, validate(RoleValidation.updateRole), RoleController.updateRoleController);

router.delete('/:workspaceId/:roleId', auth('deleteRole'), checkCreateRole,RoleController.deleteRoleController);

export default router;
       
import express, { Router } from 'express';
import {  ActionController, ActionValidation } from '../../modules/capa/workspace/capalibrary/action';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkCreateRole from './../../modules/capa/workspace/manageRole/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createAction'),
  checkCreateRole,
  validate(ActionValidation.createAction),
  ActionController.createActionController
);
router.get('/workspaces/:workspaceId/libraries/:library', auth('getWorkspaceGroups'), checkCreateRole, ActionController.getActionsByLibraryController);


// router.get('/:workspaceId/:groupId/members', auth('getGroupMembers'), checkCreateRole, ActionController.getGroupMembersController);
// router.post('/:workspaceId/:groupId/members', auth('addGroupMember'), checkCreateRole, ActionController.addMemberToGroupController);
// router.delete('/:workspaceId/:groupId/:memberId', auth('removeGroupMember'), checkCreateRole, ActionController.removeMemberFromGroupController);


// router.get('/:workspaceId/:groupId', auth('getSingleGroup'), checkCreateRole, ActionController.getGroupController);

// router.patch('/:workspaceId/:groupId', auth('updateGroup'), checkCreateRole, validate(ActionValidation.updateGroup), ActionController.updateGroupController);

// router.delete('/:workspaceId/:groupId', auth('deleteGroup'), checkCreateRole, ActionController.deleteGroupController);

export default router;
       
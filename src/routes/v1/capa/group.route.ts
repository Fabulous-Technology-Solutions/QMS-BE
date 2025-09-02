import express, { Router } from 'express';
import {  groupvalidation,groupcontroller } from '../../../modules/capa/workspace/group';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/capa/workspace/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createGroup'),
  checkCreateRole,                                                                            
  validate(groupvalidation.groupValidationSchema),
  groupcontroller.createGroupController
);
router.get('/workspace/:workspaceId', auth('getWorkspaceGroups'), checkCreateRole, groupcontroller.getWorkspaceGroupsController);
router.get('/workspace/:workspaceId/names', auth('getWorkspaceGroupNames'), checkCreateRole, groupcontroller.getGroupNamesController);

router.get('/:workspaceId/:groupId/members', auth('getGroupMembers'), checkCreateRole, groupcontroller.getGroupMembersController);
router.post('/:workspaceId/:groupId/members', auth('addGroupMember'), checkCreateRole, groupcontroller.addMemberToGroupController);
router.delete('/:workspaceId/:groupId/:memberId', auth('removeGroupMember'), checkCreateRole, groupcontroller.removeMemberFromGroupController);


router.get('/:workspaceId/:groupId', auth('getSingleGroup'), checkCreateRole, groupcontroller.getGroupController);

router.patch('/:workspaceId/:groupId', auth('updateGroup'), checkCreateRole, validate(groupvalidation.updateGroupValidationSchema), groupcontroller.updateGroupController);

router.delete('/:workspaceId/:groupId', auth('deleteGroup'), checkCreateRole, groupcontroller.deleteGroupController);

export default router;
       
import express, { Router } from 'express';
import { libraryController, libraryValidationSchema } from '../../modules/capa/workspace/capalibrary';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkCreateRole from './../../modules/capa/workspace/manageRole/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createLibrary'),
  checkCreateRole,
  validate(libraryValidationSchema.libraryValidationSchema),
  libraryController.createLibrary
);
router.get(
  '/workspace/:workspaceId',
  auth('getWorkspaceLibraries'),
  checkCreateRole,
  libraryController.getLibraries
);
router.get(
  '/workspace/:workspaceId/names',
  auth('getWorkspaceLibraryNames'),
  checkCreateRole,
  libraryController.getLibraryNamesController
);

router.get(
  '/:workspaceId/:groupId/members',
  auth('getGroupMembers'),
  checkCreateRole,
  libraryController.getLibraryMembersController
);
// router.post(
//   '/:workspaceId/:groupId/members',
//   auth('addGroupMember'),
//   checkCreateRole,
//   groupcontroller.addMemberToGroupController
// );
// router.delete(
//   '/:workspaceId/:groupId/members',
//   auth('removeGroupMember'),
//   checkCreateRole,
//   groupcontroller.removeMemberFromGroupController
// );

// router.get('/:workspaceId/:groupId', auth('getSingleGroup'), checkCreateRole, groupcontroller.getGroupController);

// router.patch(
//   '/:workspaceId/:groupId',
//   auth('updateGroup'),
//   checkCreateRole,
//   validate(libraryValidationSchema.updateLibraryValidationSchema),
//   groupcontroller.updateGroupController
// );

// router.delete('/:workspaceId/:groupId', auth('deleteGroup'), checkCreateRole, groupcontroller.deleteGroupController);

// export default router;

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
  '/workspace/:libraryId/names',
  auth('getWorkspaceLibraryNames'),
  checkCreateRole,
  libraryController.getLibraryNamesController
);

router.get(
  '/:workspaceId/:libraryId/members',
  auth('getLibraryMembers'),
  checkCreateRole,
  libraryController.getLibraryMembersController
);
router.post(
  '/:workspaceId/:libraryId/members',
  auth('addLibraryMember'),
  checkCreateRole,
  libraryController.addMemberToLibraryController
);
router.delete(
  '/:workspaceId/:libraryId/:memberId',
  auth('removeLibraryMember'),
  checkCreateRole,
  libraryController.removeMemberFromLibraryController
);

router.get('/:workspaceId/:libraryId', auth('getSingleLibrary'), checkCreateRole, libraryController.getLibrary);

router.patch(
  '/:workspaceId/:libraryId',
  auth('updateLibrary'),
  checkCreateRole,
  validate(libraryValidationSchema.updateLibraryValidationSchema),
  libraryController.updateLibraryById
);

router.delete('/:workspaceId/:libraryId', auth('deleteLibrary'), checkCreateRole, libraryController.deleteLibraryById);

export default router;

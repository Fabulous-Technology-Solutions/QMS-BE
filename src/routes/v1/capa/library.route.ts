import express, { Router } from 'express';
import { checkValidation, libraryController, libraryValidationSchema } from '../../../modules/capa/workspace/capalibrary';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/workspace/mangeRole.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createLibrary'),
  checkCreateRole,
  validate(libraryValidationSchema.libraryValidationSchema),
  activityLoggerMiddleware,
  libraryController.createLibrary
);
router.get("/generateReport/:libraryId", libraryController.generateReportController);
router.get('/workspace/:workspaceId', auth('getWorkspaceLibraries'), checkCreateRole, libraryController.getLibraries);
router.get(
  '/workspace/:workspaceId/names',
  auth('getWorkspaceLibraryNames'),
  checkCreateRole,
  libraryController.getLibraryNamesController 
);
router.patch('/:workspaceId/libraries/restore', auth('restoreLibrary'), libraryController.RestoreLibrary);
router.delete('/:workspaceId/libraries/delete', auth('deletePermanentLibrary'),  libraryController.deletePermanentLibrary);
router.get(
  '/:workspaceId/:libraryId/members',
  auth('getLibraryMembers'),
  checkValidation,
  libraryController.getLibraryMembersController
);
router.post(
  '/:workspaceId/:libraryId/members',
  auth('addLibraryMember'),
  checkValidation,
  activityLoggerMiddleware,
  libraryController.addMemberToLibraryController
);
router.delete(
  '/:workspaceId/:libraryId/:memberId',
  auth('removeLibraryMember'),
  checkValidation,
  activityLoggerMiddleware,
  libraryController.removeMemberFromLibraryController
);

router.get('/:workspaceId/:libraryId', auth('getSingleLibrary'), checkValidation, libraryController.getLibrary);

router.patch(
  '/:workspaceId/:libraryId',
  auth('updateLibrary'),
  checkValidation,
  validate(libraryValidationSchema.updateLibraryValidationSchema),
  activityLoggerMiddleware,
  libraryController.updateLibraryById
);
router.delete('/:workspaceId/:libraryId', auth('deleteLibrary'), checkValidation, activityLoggerMiddleware, libraryController.deleteLibraryById);
router.patch(
  '/:workspaceId/:libraryId/form5W2H',  
  auth('update5W2H'),
  checkValidation,
  activityLoggerMiddleware,
  libraryController.updateForm5W2HController
);
router.patch(
  '/:workspaceId/:libraryId/containment',  
  auth('updateContainment'),
  checkValidation,
  activityLoggerMiddleware,
  libraryController.updateContainmentController
);
router.get(
  '/workspace/:workspaceId/libraries/User',
  auth('getUserLibraries'),
  checkCreateRole,
  libraryController.getLibrariesForUser
);

router.get("/generateReport/:libraryId", libraryController.generateReportController);

export default router;

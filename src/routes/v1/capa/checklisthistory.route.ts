import { Router } from 'express';
import {
  createChecklistHistoryController,
  getChecklistHistoryByIdController,
  getChecklistHistoriesByLibraryController,
  updateChecklistHistoryController,
  deleteChecklistHistoryController,
} from '../../../modules/capa/workspace/capalibrary/checklisthistory/checklisthistory.controller';
import {
  createChecklistHistoryValidation,
  updateChecklistHistoryValidation,
} from '../../../modules/capa/workspace/capalibrary/checklisthistory/checklisthistory.validaton';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import { checkValidation } from '../../../modules/capa/workspace/capalibrary';

const router = Router();

router.post(
  '/',
  auth('createChecklistHistory'),
  checkValidation,
  validate(createChecklistHistoryValidation),
  createChecklistHistoryController
);

router.get(
  '/libraries/:libraryId/history/:historyId',
  auth('getChecklistHistory'),
  checkValidation,
  getChecklistHistoryByIdController
);

router.get(
  '/libraries/:libraryId',
  auth('getChecklistHistories'),
  checkValidation,
  getChecklistHistoriesByLibraryController
);

router.patch(
  '/libraries/:libraryId/history/:historyId',
  auth('updateChecklistHistory'),
  checkValidation,
  validate(updateChecklistHistoryValidation),
  updateChecklistHistoryController
);

router.delete(
  '/libraries/:libraryId/history/:historyId',
  auth('deleteChecklistHistory'),
  checkValidation,
  deleteChecklistHistoryController
);

export default router;

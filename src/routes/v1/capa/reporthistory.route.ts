import express, { Router } from 'express';
import { reportHistoryController } from '../../../modules/capa/workspace/report/reporthistory/index'
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/capa/workspace/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/workspace/:workspaceId/library/:libraryId',
  auth('getReportPrevious'),
  checkCreateRole,
  reportHistoryController.createReportHistoryController
);

export default router;

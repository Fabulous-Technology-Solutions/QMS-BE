import express, { Router } from 'express';
import { reportValidation, reportController } from '../../../modules/capa/workspace/report';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/capa/workspace/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createReport'),
  checkCreateRole,
  validate(reportValidation.createReportSchema),
  reportController.createReportController
);
router.get(
  '/workspace/:workspaceId/report/:reportId',
  auth('getReport'),
  checkCreateRole,
  reportController.getReportByIdController
);
router.get('/workspace/:workspaceId', auth('getReports'), checkCreateRole, reportController.getReportsByWorkspaceController);
router.put(
  '/workspace/:workspaceId/report/:reportId',
  auth('updateReport'),
  checkCreateRole,
  validate(reportValidation.updateReportSchema),
  reportController.updateReportController
);
router.delete(
  '/workspace/:workspaceId/report/:reportId',
  auth('deleteReport'),
  checkCreateRole,
  reportController.deleteReportController
);

export default router;

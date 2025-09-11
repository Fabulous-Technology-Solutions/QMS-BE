import express, { Router } from 'express';
import { reportValidation, reportController } from '../../../modules/risk/workspace/report';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/workspace/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('risk-createReport'),
  checkCreateRole,
  validate(reportValidation.createReportSchema),
  reportController.createReportController
);
router.get(
  '/workspace/:workspaceId/report/:reportId',
  auth('risk-getReport'),
  checkCreateRole,
  reportController.getReportByIdController
);
router.get('/workspace/:workspaceId', auth('risk-getReports'), checkCreateRole, reportController.getReportsByWorkspaceController);
router.put(
  '/workspace/:workspaceId/report/:reportId',
  auth('risk-updateReport'),
  checkCreateRole,
  validate(reportValidation.updateReportSchema),
  reportController.updateReportController
);
router.delete(
  '/workspace/:workspaceId/report/:reportId',
  auth('risk-deleteReport'),
  checkCreateRole,
  reportController.deleteReportController
);

export default router;

import express, { Router } from "express";
import {workspaceController, workspaceValidation} from "../../../modules/workspace"
import { validate } from "../../../modules/validate";
import { auth } from "../../../modules/auth";
import checkCreateRole from "../../../modules/workspace/mangeRole.middleware";
import { activityLoggerMiddleware } from "../../../modules/activitylogs/activitylogs.middleware";

const router: Router = express.Router();

router.post(
  "/",
  auth('manageCapa'),
  validate(workspaceValidation.createCapa),
  activityLoggerMiddleware,
  workspaceController.createCapaworkspaceController
);

router.get(
  "/:moduleId",
  auth('manageCapa'),

  workspaceController.getAllCapaworkspacesController
);
router.patch(
  "/module/:workspaceId",
  auth('manageCapa'),
  checkCreateRole,
  validate(workspaceValidation.updateCapa),
  activityLoggerMiddleware,
  workspaceController.updateCapaworkspaceController
);

router.delete( 
  "/module/:workspaceId",
  auth('manageCapa'),
  checkCreateRole,
  activityLoggerMiddleware,
  workspaceController.deleteCapaworkspaceController
);
router.get(
  "/module/:workspaceId",
  auth('getWorkspaceById'),
  checkCreateRole,
  workspaceController.getCapaworkspaceByIdController
);
router.get(
  "/module/:workspaceId/analytics",                                                   
  auth('manageCapa'),
  workspaceController.getCapaworkspaceAnalyticsController
);
router.get(
  "/module/:workspaceId/attention",
  auth('needAttention'),
  workspaceController.AttentionController
);
router.get(
  "/module/:workspaceId/filter",
  auth('manageCapa'),
  workspaceController.filterPreviewReportController
);
router.get(
  "/module/:workspaceId/riskfilter",
  auth('manageCapa'),
  workspaceController.filterPreviewRiskReportController
);

export default router;
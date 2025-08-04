import express, { Router } from "express";
import {workspaceController, workspaceValidation} from "../../modules/capa/workspace"
import { validate } from "../../modules/validate";
import { auth } from "../../modules/auth";
import checkCreateRole from "../../modules/capa/workspace/mangeRole.middleware";

const router: Router = express.Router();

router.post(
  "/",
  auth('manageCapa'),
  validate(workspaceValidation.createCapa),
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
  workspaceController.updateCapaworkspaceController
);

router.delete( 
  "/module/:workspaceId",
  auth('manageCapa'),
  checkCreateRole,
  workspaceController.deleteCapaworkspaceController
);
router.get(
  "/module/:workspaceId",
  auth('manageCapa'),
  workspaceController.getCapaworkspaceByIdController
);
router.get(
  "/module/:workspaceId/analytics",                                                   
  auth('manageCapa'),
  workspaceController.getCapaworkspaceAnalyticsController
);
router.get(
  "/module/:workspaceId/attention",
  auth('manageCapa'),
  workspaceController.AttentionController
);



export default router;
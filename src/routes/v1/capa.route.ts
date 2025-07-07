import express, { Router } from "express";
import {workspaceController, workspaceValidation} from "../../modules/capa/workspace"
import { validate } from "../../modules/validate";
import { auth } from "../../modules/auth";

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
  validate(workspaceValidation.updateCapa),
  workspaceController.updateCapaworkspaceController
);

router.delete(
  "/module/:workspaceId",
  auth('manageCapa'),
  workspaceController.deleteCapaworkspaceController
);
router.get(
  "/module/:workspaceId",
  auth('manageCapa'),
  workspaceController.getCapaworkspaceByIdController
);


export default router;

import express, { Router } from "express";
import { RoleController, RoleValidation} from "../../modules/capa/workspace/manageRole"
import { validate } from "../../modules/validate";
import { auth } from "../../modules/auth";

const router: Router = express.Router();

router.post(
  "/",
  auth('manageRole'),
  validate(RoleValidation.createRole),
  RoleController.createRoleController
);

router.get(
  "/:roleId",
  auth('manageRole'),
  RoleController.getRoleByIdController
);

router.patch(
  "/:roleId",
  auth('manageRole'),
  validate(RoleValidation.updateRole),
  RoleController.updateRoleController
);

router.delete(
  "/:roleId",
  auth('manageRole'),
  RoleController.deleteRoleController
);

router.get(
  "/workspace/:workspaceId",
  auth('manageRole'),
  RoleController.getWorkspaceRolesController
);
export default router;
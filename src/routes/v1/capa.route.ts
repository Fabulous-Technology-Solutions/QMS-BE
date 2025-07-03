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


export default router;
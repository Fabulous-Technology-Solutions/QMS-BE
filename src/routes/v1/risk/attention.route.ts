import { auth } from "../../../modules/auth";
import express, { Router } from "express";
import { AttentionController } from "../../../modules/risk/workspace/attention/attentation.controller";
const router: Router = express.Router();
router.get(
  "/module/:workspaceId",
  auth('needAttention'),
  AttentionController
);
export default router;
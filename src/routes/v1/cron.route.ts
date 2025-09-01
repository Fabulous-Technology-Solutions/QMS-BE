import express, { Router } from "express";
import { cronController } from "../../modules/utils";

const router: Router = express.Router();

router.post(
  "/",
  cronController.executeScheduledReports
);

export default router;

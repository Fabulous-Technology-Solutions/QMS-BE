"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workspace_1 = require("../../../modules/risk/workspace");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const mangeRole_middleware_1 = __importDefault(require("../../../modules/risk/workspace/mangeRole.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)('manageRisk'), (0, validate_1.validate)(workspace_1.workspaceValidation.createRisk), activitylogs_middleware_1.activityLoggerMiddleware, workspace_1.workspaceController.createRiskworkspaceController);
router.get("/:moduleId", (0, auth_1.auth)('manageRisk'), workspace_1.workspaceController.getAllRiskworkspacesController);
router.patch("/module/:workspaceId", (0, auth_1.auth)('manageRisk'), mangeRole_middleware_1.default, (0, validate_1.validate)(workspace_1.workspaceValidation.updateRisk), activitylogs_middleware_1.activityLoggerMiddleware, workspace_1.workspaceController.updateRiskworkspaceController);
router.delete("/module/:workspaceId", (0, auth_1.auth)('manageRisk'), mangeRole_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, workspace_1.workspaceController.deleteRiskworkspaceController);
router.get("/module/:workspaceId", (0, auth_1.auth)('manageRisk'), workspace_1.workspaceController.getRiskworkspaceByIdController);
// router.get(
//   "/module/:workspaceId/analytics",                                                   
//   auth('manageRisk'),
//   workspaceController.getRiskworkspaceAnalyticsController
// );
// router.get(
//   "/module/:workspaceId/attention",
//   auth('needAttention'),
//   workspaceController.AttentionController
// );
// router.get(
//   "/module/:workspaceId/filter",
//   auth('manageRisk'),
//   workspaceController.filterPreviewReportController
// );
exports.default = router;

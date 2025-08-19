"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_1 = require("../../modules/capa/workspace/report");
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const mangeRole_middleware_1 = __importDefault(require("../../modules/capa/workspace/mangeRole.middleware"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.auth)('createReport'), mangeRole_middleware_1.default, (0, validate_1.validate)(report_1.reportValidation.createReportSchema), report_1.reportController.createReportController);
router.get('/workspace/:workspaceId/report/:reportId', (0, auth_1.auth)('getReport'), mangeRole_middleware_1.default, report_1.reportController.getReportByIdController);
router.get('/workspace/:workspaceId', (0, auth_1.auth)('getReports'), mangeRole_middleware_1.default, report_1.reportController.getReportsByWorkspaceController);
router.put('/workspace/:workspaceId/report/:reportId', (0, auth_1.auth)('updateReport'), mangeRole_middleware_1.default, (0, validate_1.validate)(report_1.reportValidation.updateReportSchema), report_1.reportController.updateReportController);
router.delete('/workspace/:workspaceId/report/:reportId', (0, auth_1.auth)('deleteReport'), mangeRole_middleware_1.default, report_1.reportController.deleteReportController);
exports.default = router;

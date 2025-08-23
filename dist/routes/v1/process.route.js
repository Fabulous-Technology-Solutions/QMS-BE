"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const processes_1 = require("../../modules/businessManagement/processes");
const activitylogs_middleware_1 = require("../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)('manageProcesses'), (0, validate_1.validate)(processes_1.ProcessValidation.createProcessSchema), activitylogs_middleware_1.activityLoggerMiddleware, processes_1.processController.createProcess)
    .get((0, auth_1.auth)('manageProcesses'), processes_1.processController.getAllProcesses);
router
    .route('/:id')
    .get((0, auth_1.auth)('manageProcesses'), processes_1.processController.getProcess)
    .patch((0, auth_1.auth)('manageProcesses'), (0, validate_1.validate)(processes_1.ProcessValidation.updateProcessSchema), activitylogs_middleware_1.activityLoggerMiddleware, processes_1.processController.updateProcess)
    .delete((0, auth_1.auth)('manageProcesses'), activitylogs_middleware_1.activityLoggerMiddleware, processes_1.processController.deleteProcess);
router.get("/names/:moduleId", processes_1.processController.getProcessNamesByModule);
router.get("/module/:moduleId", (0, auth_1.auth)('manageProcesses'), processes_1.processController.getProcessesByModule);
router.get("/site/:siteId", (0, auth_1.auth)('manageProcesses'), processes_1.processController.getProcessesBySite);
exports.default = router;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../validate");
const auth_1 = require("../../auth");
const processController = __importStar(require("./process.controller"));
const process_validation_1 = require("./process.validation");
const activitylogs_middleware_1 = require("../../activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)('manageProcesses'), (0, validate_1.validate)(process_validation_1.createProcessSchema), activitylogs_middleware_1.activityLoggerMiddleware, processController.createProcess)
    .get((0, auth_1.auth)('manageProcesses'), processController.getAllProcesses);
router
    .route('/:id')
    .get((0, auth_1.auth)('manageProcesses'), processController.getProcess)
    .patch((0, auth_1.auth)('manageProcesses'), (0, validate_1.validate)(process_validation_1.updateProcessSchema), activitylogs_middleware_1.activityLoggerMiddleware, processController.updateProcess)
    .delete((0, auth_1.auth)('manageProcesses'), activitylogs_middleware_1.activityLoggerMiddleware, processController.deleteProcess);
router.get("/names/:moduleId", (0, auth_1.auth)('manageProcesses'), processController.getProcessNamesByModule);
router.get("/module/:moduleId", (0, auth_1.auth)('manageProcesses'), processController.getProcessesByModule);
router.get("/site/:siteId", (0, auth_1.auth)('manageProcesses'), processController.getProcessesBySite);
exports.default = router;

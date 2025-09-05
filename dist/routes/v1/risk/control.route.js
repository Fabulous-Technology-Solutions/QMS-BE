"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const control_1 = require("../../../modules/risk/workspace/library/control");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createControl'), risklibrary_middleware_1.default, (0, validate_1.validate)(control_1.controlValidation.createControlSchema), activitylogs_middleware_1.activityLoggerMiddleware, control_1.controlController.createControl);
router
    .route('/libraries/:libraryId/control/:id')
    .get((0, auth_1.auth)('getControl'), risklibrary_middleware_1.default, control_1.controlController.getControlById)
    .patch((0, auth_1.auth)('updateControl'), risklibrary_middleware_1.default, (0, validate_1.validate)(control_1.controlValidation.updateControlSchema), activitylogs_middleware_1.activityLoggerMiddleware, control_1.controlController.updateControl)
    .delete((0, auth_1.auth)('deleteControl'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, control_1.controlController.deleteControl);
router.route('/libraries/:libraryId').get((0, auth_1.auth)('getControls'), risklibrary_middleware_1.default, control_1.controlController.getAllControls);
exports.default = router;

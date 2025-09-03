"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const workspaceUser_1 = require("../../../modules/capa/workspace/workspaceUser");
const mangeRole_middleware_1 = __importDefault(require("../../../modules/workspace/mangeRole.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)('createWorkspaceUser'), (0, validate_1.validate)(workspaceUser_1.workspaceUserValidation.createWorkspaceUser), mangeRole_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, workspaceUser_1.workspaceUserController.createWorkspaceUserController);
router.route('/:workspaceId').get((0, auth_1.auth)('getWorkspaceUsers'), mangeRole_middleware_1.default, workspaceUser_1.workspaceUserController.getWorkspaceUsersController);
router
    .route('/:workspaceId/names')
    .get((0, auth_1.auth)('getWorkspaceUsers'), mangeRole_middleware_1.default, workspaceUser_1.workspaceUserController.getworkspacegroupsNamesController);
router
    .route('/:workspaceId/:userId')
    .patch((0, auth_1.auth)('updateWorkspaceUser'), mangeRole_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, workspaceUser_1.workspaceUserController.updateWorkspaceUserController)
    .get((0, auth_1.auth)('getSingleWorkspaceUser'), mangeRole_middleware_1.default, workspaceUser_1.workspaceUserController.getSingleWorkspaceUserController)
    .delete((0, auth_1.auth)('deleteWorkspaceUser'), mangeRole_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, workspaceUser_1.workspaceUserController.deleteWorkspaceUserController);
exports.default = router;

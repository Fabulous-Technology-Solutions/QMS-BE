"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const action_1 = require("../../../modules/risk/workspace/library/action");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router.post('/', (0, auth_1.auth)('risk_createAction'), risklibrary_middleware_1.default, (0, validate_1.validate)(action_1.ActionValidation.createAction), activitylogs_middleware_1.activityLoggerMiddleware, action_1.ActionController.createActionController);
router.get("/tasks", (0, auth_1.auth)("risk_getTasks"), action_1.ActionController.getTasksByUserController);
router.get('/libraries/:libraryId', (0, auth_1.auth)('risk_getActions'), risklibrary_middleware_1.default, action_1.ActionController.getActionsByLibraryController);
router.get('/libraries/:libraryId/action/:actionId', (0, auth_1.auth)('risk_getSingleAction'), risklibrary_middleware_1.default, action_1.ActionController.getActionByIdController);
router.patch('/libraries/:libraryId/action/:actionId', (0, auth_1.auth)('risk_updateAction'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, action_1.ActionController.updateActionController);
router.delete('/libraries/:libraryId/action/:actionId', (0, auth_1.auth)('risk_deleteAction'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, action_1.ActionController.deleteActionController);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manageRole_1 = require("../../../modules/workspace/manageRole");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const mangeRole_middleware_1 = __importDefault(require("../../../modules/workspace/mangeRole.middleware"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.auth)('createRole'), mangeRole_middleware_1.default, (0, validate_1.validate)(manageRole_1.RoleValidation.createRole), manageRole_1.RoleController.createRoleController);
router.get('/workspace/:workspaceId', (0, auth_1.auth)('createRole'), mangeRole_middleware_1.default, manageRole_1.RoleController.getWorkspaceRolesController);
router.get('/workspace/:workspaceId/names', (0, auth_1.auth)('getWorkspaceRoleNames'), mangeRole_middleware_1.default, manageRole_1.RoleController.getWorkspaceRoleNamesController);
router.get('/:workspaceId/:roleId', (0, auth_1.auth)('getSingleRole'), mangeRole_middleware_1.default, manageRole_1.RoleController.getRoleByIdController);
router.patch('/:workspaceId/:roleId', (0, auth_1.auth)('updateRole'), mangeRole_middleware_1.default, (0, validate_1.validate)(manageRole_1.RoleValidation.updateRole), manageRole_1.RoleController.updateRoleController);
router.delete('/:workspaceId/:roleId', (0, auth_1.auth)('deleteRole'), mangeRole_middleware_1.default, manageRole_1.RoleController.deleteRoleController);
exports.default = router;

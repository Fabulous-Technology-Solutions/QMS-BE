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
exports.getWorkspaceRoleNamesController = exports.getWorkspaceRolesController = exports.getRoleByIdController = exports.deleteRoleController = exports.updateRoleController = exports.createRoleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const roleService = __importStar(require("./manageRole.service"));
exports.createRoleController = (0, catchAsync_1.default)(async (req, res) => {
    const role = await roleService.createRole(req.body);
    return res.status(http_status_1.default.CREATED).send({
        success: true,
        data: role,
    });
});
exports.updateRoleController = (0, catchAsync_1.default)(async (req, res) => {
    const role = await roleService.updateRole(req.params["roleId"], req.body);
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: role,
    });
});
exports.deleteRoleController = (0, catchAsync_1.default)(async (req, res) => {
    const role = await roleService.deleteRole(req.params["roleId"]);
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: role,
    });
});
exports.getRoleByIdController = (0, catchAsync_1.default)(async (req, res) => {
    const role = await roleService.getRoleById(req.params["roleId"]);
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: role,
    });
});
exports.getWorkspaceRolesController = (0, catchAsync_1.default)(async (req, res) => {
    console.log("Fetching roles for workspace:", req.params["workspaceId"]);
    const roles = await roleService.getworkspaceRoles({ workspace: req.params["workspaceId"], search: req.query["search"], page: Number(req.query["page"]) || 1, limit: Number(req.query["limit"]) || 10 });
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: roles,
    });
});
exports.getWorkspaceRoleNamesController = (0, catchAsync_1.default)(async (req, res) => {
    console.log("Fetching role names for workspace:", req.params["workspaceId"]);
    const roleNames = await roleService.getworkspacerolenames(req.params["workspaceId"]);
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: roleNames,
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getworkspacegroupsNamesController = exports.getSingleWorkspaceUserController = exports.getWorkspaceUsersController = exports.deleteWorkspaceUserController = exports.updateWorkspaceUserController = exports.createWorkspaceUserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const workspaceUser_service_1 = require("./workspaceUser.service");
const createWorkspaceUserController = (0, catchAsync_1.default)(async (req, res) => {
    const user = await (0, workspaceUser_service_1.createWorkspaceUser)(req.body);
    res.locals["message"] = "create workspace user";
    res.locals["documentId"] = user._id;
    res.locals["collectionName"] = "WorkspaceUser";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.locals["changes"] = user;
    res.status(201).json({
        success: true,
        message: 'Workspace user created successfully',
        data: user,
    });
});
exports.createWorkspaceUserController = createWorkspaceUserController;
const updateWorkspaceUserController = (0, catchAsync_1.default)(async (req, res) => {
    const user = await (0, workspaceUser_service_1.updateWorkspaceUser)(req.params['userId'], req.body);
    res.locals["message"] = "update workspace user";
    res.locals["documentId"] = user._id || "";
    res.locals["collectionName"] = "WorkspaceUser";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.locals["changes"] = user;
    res.status(200).json({
        success: true,
        message: 'Workspace user updated successfully',
        data: user,
    });
});
exports.updateWorkspaceUserController = updateWorkspaceUserController;
const deleteWorkspaceUserController = (0, catchAsync_1.default)(async (req, res) => {
    const user = await (0, workspaceUser_service_1.deleteWorkspaceUser)(req.params['userId']);
    res.locals["message"] = "delete workspace user";
    res.locals["documentId"] = user._id || "";
    res.locals["collectionName"] = "WorkspaceUser";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    // If the user is not found, it will throw an error
    res.status(200).json({
        success: true,
        message: 'Workspace user deleted successfully',
        data: user,
    });
});
exports.deleteWorkspaceUserController = deleteWorkspaceUserController;
const getWorkspaceUsersController = (0, catchAsync_1.default)(async (req, res) => {
    const users = await (0, workspaceUser_service_1.getWorkspaceUsers)(req.params['workspaceId'], Number(req.query['page']) || 1, Number(req.query['limit']) || 10, req.query['search']);
    res.status(200).json({
        success: true,
        message: 'Workspace users retrieved successfully',
        data: users,
    });
});
exports.getWorkspaceUsersController = getWorkspaceUsersController;
const getSingleWorkspaceUserController = (0, catchAsync_1.default)(async (req, res) => {
    const user = await (0, workspaceUser_service_1.getSingleWorkspaceUser)(req.params['userId']);
    res.status(200).json({
        success: true,
        message: 'Workspace user retrieved successfully',
        data: user,
    });
});
exports.getSingleWorkspaceUserController = getSingleWorkspaceUserController;
const getworkspacegroupsNamesController = (0, catchAsync_1.default)(async (req, res) => {
    const users = await (0, workspaceUser_service_1.getworkspaceusersnames)(req.params['workspaceId']);
    res.status(200).json({
        success: true,
        message: 'Workspace users names retrieved successfully',
        data: users,
    });
});
exports.getworkspacegroupsNamesController = getworkspacegroupsNamesController;

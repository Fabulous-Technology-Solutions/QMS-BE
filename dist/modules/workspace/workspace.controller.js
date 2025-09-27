"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPreviewRiskReportController = exports.filterPreviewReportController = exports.AttentionController = exports.getCapaworkspaceAnalyticsController = exports.deleteCapaworkspaceController = exports.updateCapaworkspaceController = exports.getCapaworkspaceByIdController = exports.getAllCapaworkspacesController = exports.createCapaworkspaceController = void 0;
const index_1 = require("./index");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const action_service_1 = require("../capa/workspace/capalibrary/action/action.service");
const capalibrary_service_1 = require("../capa/workspace/capalibrary/capalibrary.service");
const risklibrary_service_1 = require("../risk/workspace/library/risklibrary.service");
const account_1 = require("../account");
exports.createCapaworkspaceController = (0, catchAsync_1.default)(async (req, res) => {
    const workspace = await index_1.workspaceService.createCapaworkspace({ ...req.body, user: req.user });
    res.locals['message'] = 'create workspace';
    res.locals['documentId'] = workspace._id || '';
    res.locals['collectionName'] = 'Workspace';
    res.locals['changes'] = workspace;
    res.locals['logof'] = req.body.moduleId || null;
    return res.status(http_status_1.default.CREATED).send({
        success: true,
        data: workspace,
    });
});
exports.getAllCapaworkspacesController = (0, catchAsync_1.default)(async (req, res) => {
    // Authorization logic
    if (req.headers['accountId']) {
        const workspaces = await account_1.accountServices.getModuleWorkspaces(req.headers['accountId'], req.params['moduleId'], req.user._id);
        return res.status(http_status_1.default.OK).send({
            success: true,
            data: workspaces,
        });
    }
    const { page = 1, limit = 10, search } = req.query;
    const workspaces = await index_1.workspaceService.getAllCapaworkspaces({
        moduleId: req.params['moduleId'],
        user: req.user,
        Page: Number(page),
        Limit: Number(limit),
        search: search,
    });
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: workspaces,
    });
});
exports.getCapaworkspaceByIdController = (0, catchAsync_1.default)(async (req, res, next) => {
    const workspace = await index_1.workspaceService.getCapaworkspaceById(req.params['workspaceId']);
    if (!workspace) {
        return next(new ApiError_1.default('Workspace not found', http_status_1.default.NOT_FOUND));
    }
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: workspace,
    });
});
exports.updateCapaworkspaceController = (0, catchAsync_1.default)(async (req, res, next) => {
    const workspace = await index_1.workspaceService.updateCapaworkspace(req.params['workspaceId'], req.body);
    if (!workspace) {
        return next(new ApiError_1.default('Workspace not found', http_status_1.default.NOT_FOUND));
    }
    res.locals['message'] = 'update workspace';
    res.locals['documentId'] = workspace._id || '';
    res.locals['collectionName'] = 'Workspace';
    res.locals['changes'] = workspace;
    res.locals['logof'] = workspace.moduleId || null;
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: workspace,
    });
});
exports.deleteCapaworkspaceController = (0, catchAsync_1.default)(async (req, res, next) => {
    const workspace = await index_1.workspaceService.deleteCapaworkspace(req.params['workspaceId']);
    if (!workspace) {
        return next(new ApiError_1.default('Workspace not found', http_status_1.default.NOT_FOUND));
    }
    res.locals['message'] = 'delete workspace';
    res.locals['documentId'] = workspace._id || '';
    res.locals['collectionName'] = 'Workspace';
    res.locals['changes'] = { isDeleted: true };
    res.locals['logof'] = workspace.moduleId || null;
    return res.status(http_status_1.default.OK).send({
        success: true,
        message: 'Workspace deleted successfully',
    });
});
exports.getCapaworkspaceAnalyticsController = (0, catchAsync_1.default)(async (req, res) => {
    const analytics = await index_1.workspaceService.dashboardAnalytics(req.params['workspaceId']);
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: analytics,
    });
});
exports.AttentionController = (0, catchAsync_1.default)(async (req, res) => {
    const { page = 1, limit = 10, search = '', filterData } = req.query;
    if (!filterData) {
        throw new ApiError_1.default('Filter data is required', http_status_1.default.BAD_REQUEST);
    }
    console.log('Filter data:', filterData);
    if (filterData === 'action') {
        const actions = await (0, action_service_1.getActionsByWorkspace)(req.params['workspaceId'], Number(page), Number(limit), search);
        res.status(200).json(actions);
    }
    else if (filterData === 'library') {
        const libraries = await (0, capalibrary_service_1.getLibrariesfilterData)(req.params['workspaceId'], Number(page), Number(limit), search);
        res.status(200).json(libraries);
    }
    else {
        throw new ApiError_1.default('Invalid filter data', http_status_1.default.BAD_REQUEST);
    }
});
exports.filterPreviewReportController = (0, catchAsync_1.default)(async (req, res) => {
    const { site, process, status } = req.query;
    const report = await (0, capalibrary_service_1.generateFilterReport)(req.params['workspaceId'], site, process, status);
    res.status(200).json({ report, success: true });
});
exports.filterPreviewRiskReportController = (0, catchAsync_1.default)(async (req, res) => {
    const { site, process, status } = req.query;
    const report = await (0, risklibrary_service_1.generateFilterReport)(req.params['workspaceId'], site, process, status);
    res.status(200).json({ report, success: true });
});

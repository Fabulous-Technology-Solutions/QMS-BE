"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRiskworkspaceController = exports.updateRiskworkspaceController = exports.getRiskworkspaceByIdController = exports.getAllRiskworkspacesController = exports.createRiskworkspaceController = void 0;
const index_1 = require("./index");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// import { getActionsByWorkspace } from './Risklibrary/action/action.service';
// import { generateFilterReport, getLibrariesfilterData } from './Risklibrary/Risklibrary.service';
exports.createRiskworkspaceController = (0, catchAsync_1.default)(async (req, res) => {
    const workspace = await index_1.workspaceService.createRiskworkspace({ ...req.body, user: req.user });
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
exports.getAllRiskworkspacesController = (0, catchAsync_1.default)(async (req, res) => {
    // Authorization logic
    if (req.user && req.user.role === 'admin') {
        // Admin can see workspaces they created
    }
    else if (req.user && req.user.role === 'sub-admin') {
        // Sub-admin can see workspaces created by their admin
    }
    else {
        throw new Error('Unauthorized');
    }
    const { page = 1, limit = 10, search } = req.query;
    const workspaces = await index_1.workspaceService.getAllRiskworkspaces({
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
exports.getRiskworkspaceByIdController = (0, catchAsync_1.default)(async (req, res, next) => {
    const workspace = await index_1.workspaceService.getRiskworkspaceById(req.params['workspaceId']);
    if (!workspace) {
        return next(new ApiError_1.default('Workspace not found', http_status_1.default.NOT_FOUND));
    }
    return res.status(http_status_1.default.OK).send({
        success: true,
        data: workspace,
    });
});
exports.updateRiskworkspaceController = (0, catchAsync_1.default)(async (req, res, next) => {
    const workspace = await index_1.workspaceService.updateRiskworkspace(req.params['workspaceId'], req.body);
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
exports.deleteRiskworkspaceController = (0, catchAsync_1.default)(async (req, res, next) => {
    const workspace = await index_1.workspaceService.deleteRiskworkspace(req.params['workspaceId']);
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
// export const getRiskworkspaceAnalyticsController = catchAsync(async (req: Request, res: Response) => {
//   const analytics = await workspaceService.dashboardAnalytics(req.params['workspaceId'] as string);
//   return res.status(httpStatus.OK).send({
//     success: true,
//     data: analytics,
//   });
// });
// export const AttentionController = catchAsync(async (req: Request, res: Response) => {
//   const { page = 1, limit = 10, search = '', filterData } = req.query;
//   if (!filterData) {
//     throw new AppiError('Filter data is required', httpStatus.BAD_REQUEST);
//   }
//   console.log('Filter data:', filterData);
//   if (filterData === 'action') {
//     const actions = await getActionsByWorkspace(
//       req.params['workspaceId'] as string,
//       Number(page),
//       Number(limit),
//       search as string
//     );
//     res.status(200).json(actions);
//   } else if (filterData === 'library') {
//     const libraries = await getLibrariesfilterData(
//       req.params['workspaceId'] as string,
//       Number(page),
//       Number(limit),
//       search as string
//     );
//     res.status(200).json(libraries);
//   } else {
//     throw new AppiError('Invalid filter data', httpStatus.BAD_REQUEST);
//   }
// });
// export const filterPreviewReportController = catchAsync(async (req: Request, res: Response) => {
//   const { site, process, status } = req.query;
//   const report = await generateFilterReport(
//     req.params['workspaceId'] as string,
//     site as string,
//     process as string,
//     status as string
//   );
//   res.status(200).json({ report, success: true });
// });

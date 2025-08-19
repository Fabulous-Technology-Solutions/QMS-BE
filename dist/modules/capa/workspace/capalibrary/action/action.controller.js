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
exports.getTasksByUserController = exports.deleteActionController = exports.getActionsByLibraryController = exports.getLibraryMembersByActionController = exports.updateActionController = exports.getActionByIdController = exports.createActionController = void 0;
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const actionService = __importStar(require("./action.service"));
exports.createActionController = (0, catchAsync_1.default)(async (req, res) => {
    const action = await actionService.createAction({
        ...req.body,
        createdBy: req.user._id
    });
    res.locals["message"] = "create action";
    res.locals["documentId"] = action._id;
    res.locals["collectionName"] = "Action";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = action;
    res.status(201).json({
        success: true,
        message: 'Action created successfully',
        data: action,
    });
});
exports.getActionByIdController = (0, catchAsync_1.default)(async (req, res) => {
    const action = await actionService.getActionById(req.params["actionId"] || '', req.headers["datatype"] === "mytasks" ? req.user._id : undefined);
    res.status(200).json({
        success: true,
        message: 'Action retrieved successfully',
        data: action,
    });
});
exports.updateActionController = (0, catchAsync_1.default)(async (req, res) => {
    const action = await actionService.updateAction(req.params["actionId"] || '', req.body, req.headers["datatype"] === "mytasks" ? req.user._id : undefined);
    res.locals["message"] = "update action";
    res.locals["documentId"] = action._id;
    res.locals["collectionName"] = "Action";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = action;
    res.status(200).json({
        success: true,
        message: 'Action updated successfully',
        data: action,
    });
});
exports.getLibraryMembersByActionController = (0, catchAsync_1.default)(async (req, res) => {
    const { library } = req.params;
    const { search = '', page = 1, limit = 10 } = req.query;
    const members = await actionService.getLibraryMembersByAction(library, search, Number(page), Number(limit));
    res.status(200).json({
        success: true,
        message: 'Library members retrieved successfully',
        data: members,
    });
});
exports.getActionsByLibraryController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const actions = await actionService.getActionsByLibrary(libraryId, Number(req.query["page"]) || 1, Number(req.query["limit"]) || 10, req.query["search"]);
    res.status(200).json({
        success: true,
        message: 'Actions retrieved successfully',
        data: actions,
    });
});
exports.deleteActionController = (0, catchAsync_1.default)(async (req, res) => {
    const action = await actionService.deleteAction(req.params["actionId"] || '', req.headers["datatype"] === "mytasks" ? req.user._id : undefined);
    res.locals["message"] = "delete action";
    res.locals["documentId"] = action._id;
    res.locals["collectionName"] = "Action";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.params['libraryId'];
    res.status(200).json({
        success: true,
        message: 'Action deleted successfully',
        data: action,
    });
});
exports.getTasksByUserController = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const tasks = await actionService.getActionsByAssignedTo(userId, Number(page), Number(limit), search);
    res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
    });
});

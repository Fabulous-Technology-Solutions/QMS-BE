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
exports.getChecklistNames = exports.getChecklistsByWorkspaceId = exports.deleteChecklist = exports.updateChecklist = exports.getChecklistById = exports.createChecklist = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const checklistService = __importStar(require("./checklist.services"));
exports.createChecklist = (0, catchAsync_1.default)(async (req, res) => {
    const checklist = await checklistService.createCheckList({
        ...req.body,
        createdBy: req.user._id,
    });
    res.status(201).json({
        success: true,
        message: 'Checklist created successfully',
        data: checklist,
    });
});
exports.getChecklistById = (0, catchAsync_1.default)(async (req, res) => {
    const checklist = await checklistService.getCheckListById(req.params['checklistId']);
    res.status(200).json({
        success: true,
        message: 'Checklist retrieved successfully',
        data: checklist,
    });
});
exports.updateChecklist = (0, catchAsync_1.default)(async (req, res) => {
    const checklist = await checklistService.updateCheckList(req.params['checklistId'], req.body);
    res.status(200).json({
        success: true,
        message: 'Checklist updated successfully',
        data: checklist,
    });
});
exports.deleteChecklist = (0, catchAsync_1.default)(async (req, res) => {
    const checklist = await checklistService.deleteCheckList(req.params['checklistId']);
    res.status(200).json({
        success: true,
        message: 'Checklist deleted successfully',
        data: checklist,
    });
});
exports.getChecklistsByWorkspaceId = (0, catchAsync_1.default)(async (req, res) => {
    const checklists = await checklistService.getCheckListByWorkspaceId(req.params['workspaceId'], req.query['search'], Number(req.query["page"] || 1), Number(req.query["limit"] || 10));
    res.status(200).json({
        success: true,
        message: 'Checklists retrieved successfully',
        data: checklists,
    });
});
exports.getChecklistNames = (0, catchAsync_1.default)(async (req, res) => {
    const checklistNames = await checklistService.getCheckListNamesByWorkspaceId(req.params['workspaceId']);
    res.status(200).json({
        success: true,
        message: 'Checklist names retrieved successfully',
        data: checklistNames,
    });
});

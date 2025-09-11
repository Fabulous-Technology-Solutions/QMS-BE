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
exports.deleteReportController = exports.updateReportController = exports.getReportsByWorkspaceController = exports.getReportByIdController = exports.createReportController = void 0;
const ReportService = __importStar(require("./report.services"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
exports.createReportController = (0, catchAsync_1.default)(async (req, res) => {
    const data = { ...req.body, createdBy: req.user._id };
    const report = await ReportService.createReport(data);
    res.locals["message"] = "create Report";
    res.locals["documentId"] = report._id;
    res.locals["collectionName"] = "Report";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(201).json({ success: true, data: report });
});
exports.getReportByIdController = (0, catchAsync_1.default)(async (req, res) => {
    const { reportId } = req.params;
    const report = await ReportService.getReportById(reportId);
    res.status(200).json({ success: true, data: report });
});
exports.getReportsByWorkspaceController = (0, catchAsync_1.default)(async (req, res) => {
    const { workspaceId } = req.params;
    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const result = await ReportService.getReportsByWorkspace(workspaceId, page, limit);
    res.status(200).json({ success: true, ...result });
});
exports.updateReportController = (0, catchAsync_1.default)(async (req, res) => {
    const { reportId } = req.params;
    const updated = await ReportService.updateReport(reportId, req.body);
    res.locals["message"] = "update Report";
    res.locals["documentId"] = updated?._id;
    res.locals["collectionName"] = "Report";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({ success: true, data: updated });
});
exports.deleteReportController = (0, catchAsync_1.default)(async (req, res) => {
    const { reportId } = req.params;
    await ReportService.deleteReport(reportId);
    res.locals["message"] = "delete Report";
    res.locals["documentId"] = reportId;
    res.locals["collectionName"] = "Report";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(204).send();
});

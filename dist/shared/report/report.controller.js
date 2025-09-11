"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const catchAsync_1 = __importDefault(require("../../modules/utils/catchAsync"));
class ReportController {
    constructor(reportService, collectionName = 'Report') {
        this.createReportController = (0, catchAsync_1.default)(async (req, res) => {
            const data = { ...req.body, createdBy: req.user._id };
            const report = await this.reportService.createReport(data);
            res.locals["message"] = "create Report";
            res.locals["documentId"] = report._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
            res.status(201).json({ success: true, data: report });
        });
        this.getReportByIdController = (0, catchAsync_1.default)(async (req, res) => {
            const { reportId } = req.params;
            const report = await this.reportService.getReportById(reportId);
            res.status(200).json({ success: true, data: report });
        });
        this.getReportsByWorkspaceController = (0, catchAsync_1.default)(async (req, res) => {
            const { workspaceId } = req.params;
            const page = Number(req.query["page"]) || 1;
            const limit = Number(req.query["limit"]) || 10;
            const result = await this.reportService.getReportsByWorkspace(workspaceId, page, limit);
            res.status(200).json(result);
        });
        this.updateReportController = (0, catchAsync_1.default)(async (req, res) => {
            const { reportId } = req.params;
            const updated = await this.reportService.updateReport(reportId, req.body);
            res.locals["message"] = "update Report";
            res.locals["documentId"] = updated?._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
            res.status(200).json({ success: true, data: updated });
        });
        this.deleteReportController = (0, catchAsync_1.default)(async (req, res) => {
            const { reportId } = req.params;
            await this.reportService.deleteReport(reportId);
            res.locals["message"] = "delete Report";
            res.locals["documentId"] = reportId;
            res.locals["collectionName"] = this.collectionName;
            res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
            res.status(204).send();
        });
        // Additional controller methods using the service
        this.getReportsByStatusController = (0, catchAsync_1.default)(async (req, res) => {
            const { status } = req.params;
            const page = Number(req.query["page"]) || 1;
            const limit = Number(req.query["limit"]) || 10;
            const result = await this.reportService.getReportsByStatus(status, page, limit);
            res.status(200).json(result);
        });
        this.getScheduledReportsController = (0, catchAsync_1.default)(async (_req, res) => {
            const reports = await this.reportService.getScheduledReports();
            res.status(200).json({ success: true, data: reports });
        });
        this.deleteReportMediaController = (0, catchAsync_1.default)(async (req, res) => {
            const { reportId } = req.params;
            const report = await this.reportService.deleteReportMedia(reportId);
            res.locals["message"] = "soft delete Report";
            res.locals["documentId"] = reportId;
            res.locals["collectionName"] = this.collectionName;
            res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
            res.status(200).json({ success: true, data: report });
        });
        this.reportService = reportService;
        this.collectionName = collectionName;
    }
}
exports.ReportController = ReportController;

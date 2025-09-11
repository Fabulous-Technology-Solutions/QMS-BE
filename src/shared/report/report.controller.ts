
import catchAsync from "../../modules/utils/catchAsync";
import { Request, Response } from 'express';
import ReportService from "./report.services";

export class ReportController {
  private reportService: ReportService;
  private collectionName: string;

  constructor(reportService: ReportService, collectionName: string = 'Report') {
    this.reportService = reportService;
    this.collectionName = collectionName;
  }

  createReportController = catchAsync(async (req: Request, res: Response) => {
    const data = { ...req.body, createdBy: req.user._id };
    const report = await this.reportService.createReport(data);
    res.locals["message"] = "create Report";
    res.locals["documentId"] = report._id;
    res.locals["collectionName"] = this.collectionName;
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(201).json({ success: true, data: report });
  });

  getReportByIdController = catchAsync(async (req: Request, res: Response) => {
    const { reportId } = req.params as { reportId: string };
    const report = await this.reportService.getReportById(reportId);
    res.status(200).json({ success: true, data: report });
  });

  getReportsByWorkspaceController = catchAsync(async (req: Request, res: Response) => {
    const { workspaceId } = req.params as { workspaceId: string };
    const page = Number(req.query["page"] as string) || 1;
    const limit = Number(req.query["limit"] as string) || 10;
    const result = await this.reportService.getReportsByWorkspace(workspaceId, page, limit);
    res.status(200).json(result);
  });

  updateReportController = catchAsync(async (req: Request, res: Response) => {
    const { reportId } = req.params as { reportId: string };
    const updated = await this.reportService.updateReport(reportId, req.body);
    res.locals["message"] = "update Report";
    res.locals["documentId"] = updated?._id;
    res.locals["collectionName"] = this.collectionName;
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({ success: true, data: updated });
  });

  deleteReportController = catchAsync(async (req: Request, res: Response) => {
    const { reportId } = req.params as { reportId: string };
    await this.reportService.deleteReport(reportId);
    res.locals["message"] = "delete Report";
    res.locals["documentId"] = reportId;
    res.locals["collectionName"] = this.collectionName;
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(204).send();
  });

  // Additional controller methods using the service
  getReportsByStatusController = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.params as { status: string };
    const page = Number(req.query["page"] as string) || 1;
    const limit = Number(req.query["limit"] as string) || 10;
    const result = await this.reportService.getReportsByStatus(status, page, limit);
    res.status(200).json(result);
  });

  getScheduledReportsController = catchAsync(async (_req: Request, res: Response) => {
    const reports = await this.reportService.getScheduledReports();
    res.status(200).json({ success: true, data: reports });
  });

  deleteReportMediaController = catchAsync(async (req: Request, res: Response) => {
    const { reportId } = req.params as { reportId: string };
    const report = await this.reportService.deleteReportMedia(reportId);
    res.locals["message"] = "soft delete Report";
    res.locals["documentId"] = reportId;
    res.locals["collectionName"] = this.collectionName;
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({ success: true, data: report });
  });
}

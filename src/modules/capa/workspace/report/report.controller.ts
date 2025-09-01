import * as ReportService from './report.services';
import catchAsync from "../../../utils/catchAsync";
import  { Request, Response } from 'express';

export const createReportController = catchAsync(async (req: Request, res: Response) => {
  const data = { ...req.body, createdBy: req.user._id };
  const report = await ReportService.createReport(data);
  res.status(201).json({ success: true, data: report });
});              

export const getReportByIdController = catchAsync(async (req: Request, res: Response) => {
  const { reportId } = req.params as { reportId: string };
  const report = await ReportService.getReportById(reportId);
  res.status(200).json({ success: true, data: report });
});

export const getReportsByWorkspaceController = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params as { workspaceId: string };
  const page = Number(req.query["page"] as string) || 1;
  const limit = Number(req.query["limit"] as string) || 10;
  const result = await ReportService.getReportsByWorkspace(workspaceId, page, limit);
  res.status(200).json({ success: true, ...result });
});


export const updateReportController = catchAsync(async (req: Request, res: Response) => {
  const { reportId } = req.params as { reportId: string };
  const updated = await ReportService.updateReport(reportId, req.body);
  res.status(200).json({ success: true, data: updated });
});
export const deleteReportController = catchAsync(async (req: Request, res: Response) => {
  const { reportId } = req.params as { reportId: string };
  await ReportService.deleteReport(reportId);
  res.status(204).send();
});

import mongoose from 'mongoose';
import { ICreateReport } from './report.interfaces';

import ReportModel from './report.modal';

export const createReport = async (data: ICreateReport) => {
  const newReport = new ReportModel({
    name: data.name,
    schedule: data.schedule,
    scheduleFrequency: data.scheduleFrequency,
    scheduleEmails: data.scheduleEmails,
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
    workspace: new mongoose.Types.ObjectId(data.workspace),
    library: new mongoose.Types.ObjectId(data.library),
  });
  return await newReport.save();
};

export const getReportById = async (reportId: string) => {
  const report = await ReportModel.findById(reportId).populate('createdBy');
  return report;
};

export const getReportsByWorkspace = async (workspaceId: string, page = 1, limit = 10) => {
  const match = { workspace: new mongoose.Types.ObjectId(workspaceId) };
  const total = await ReportModel.countDocuments(match);
  const data = await ReportModel.find(match)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('createdBy');
  return { data, total, page, limit };
};

export const updateReport = async (reportId: string, data: Partial<ICreateReport>) => {
  
  const report = await ReportModel.findByIdAndUpdate(reportId, data, { new: false });
  return report;
};

export const deleteReport = async (reportId: string) => {
  const report = await ReportModel.findByIdAndDelete(reportId, {});
  if (!report) {
    throw new Error('Report not found');
  }
 
  return report;
};



export const deleteReportMedia = async (reportId: string) => {
  const report = await ReportModel.findByIdAndUpdate(reportId, { isDeleted: true }, { new: true });
  if (!report) {
    throw new Error('Report not found');
  }
  return report;
};
    
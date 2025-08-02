import mongoose from 'mongoose';
import { ICreateReport } from './report.interfaces';

import ReportModel from './report.modal';
import { deleteMedia } from '@/modules/upload/upload.middleware';

export const createReport = async (data: ICreateReport) => {
  const newReport = new ReportModel({
    name: data.name,
    type: data.type,
    format: data.format,
    schedule: data.schedule,
    scheduleFrequency: data.scheduleFrequency,
    scheduleEmails: data.scheduleEmails,
    startDate: data.startDate,
    endDate: data.endDate,
    site: data.site,
    department: data.department,
    docfile: data.docfile,
    dockey: data.dockey,
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
    workspace: new mongoose.Types.ObjectId(data.workspace),
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
  const updateData: Partial<ICreateReport> = {};
  if (data.name) updateData.name = data.name;
  if (data.type) updateData.type = data.type;
  if (data.format) updateData.format = data.format;
  if (data.schedule !== undefined) updateData.schedule = data.schedule;
  if (data.scheduleFrequency) updateData.scheduleFrequency = data.scheduleFrequency;
  if (data.scheduleEmails) updateData.scheduleEmails = data.scheduleEmails;
  if (data.startDate) updateData.startDate = data.startDate;
  if (data.endDate) updateData.endDate = data.endDate;
  if (data.site) updateData.site = data.site;
  if (data.department) updateData.department = data.department;
  if (data.docfile) updateData.docfile = data.docfile;
  if (data.dockey) updateData.dockey = data.dockey;

  const report = await ReportModel.findByIdAndUpdate(reportId, updateData, { new: false });

  if (data.dockey) {
    await deleteMedia(report?.dockey || ''); // Assuming deleteMedia is a function that handles the deletion of media files
  }

  if (report) {
    Object.assign(report, updateData);
  }

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
    
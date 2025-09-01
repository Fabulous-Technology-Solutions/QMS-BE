import mongoose from 'mongoose';
import { ICreateReport } from './report.interfaces';

import ReportModel from './report.modal';
import { generateFilterReport } from '../capalibrary/capalibrary.service';
import { sendEmail } from '../../../email/email.service';
import  User  from '../../../user/user.model';


export const getNextScheduleDate = (frequency?: string): Date => {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      return now;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      return now;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      return now;
    default:
      throw new Error('Invalid frequency');
  }
};


export const createReport = async (data: ICreateReport) => {

  const report = await generateFilterReport(data.workspace, data.process, data.site, data.status);
  const users=await  User.find({_id: {$in: data.assignUsers}});
  const emailAddresses = users.map(user => user.email);
  if (emailAddresses && emailAddresses.length > 0 && report?.Location) {
    await sendEmail(
      emailAddresses.join(',') || "<default_email@example.com>",
      `Report Generated: ${data.name}`,
      '',
      `<p>Dear User,</p>
      <p>The report has been successfully generated.</p>
      <p>You can download the report using the link below:</p>
      <p><a href="${report?.Location}">Download Report</a></p>
      <p>Best regards,<br/>QMS Team</p>`
    );
  }
  const nextScheduleDate = getNextScheduleDate(data?.scheduleFrequency);
  const newReport = new ReportModel({
    name: data.name,
    schedule: data.schedule,
    scheduleFrequency: data.scheduleFrequency,
    assignUsers: data.assignUsers,
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
    workspace: new mongoose.Types.ObjectId(data.workspace),
    process: new mongoose.Types.ObjectId(data.process),
    site: new mongoose.Types.ObjectId(data.site),
    status: data.status || 'pending',
    lastSchedule: Date.now(),
    nextSchedule: nextScheduleDate,
  });
  return await newReport.save();
};

export const getReportById = async (reportId: string) => {
  const report = await ReportModel.findById(reportId).populate("process").populate('site').populate("assignUsers","name email profilePicture").populate('createdBy','name email profilePicture');
  return report;
};

export const getReportsByWorkspace = async (workspaceId: string, page = 1, limit = 10) => {
  const match = { workspace: new mongoose.Types.ObjectId(workspaceId) };
  const total = await ReportModel.countDocuments(match);
  const data = await ReportModel.find(match).populate("process").populate('site').populate("assignUsers","name email profilePicture").populate('createdBy','name email profilePicture')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
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
    
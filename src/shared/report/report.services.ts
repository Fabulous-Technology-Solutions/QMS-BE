import mongoose, { Model } from 'mongoose';
import { ICreateReport, ReportModal } from './report.interfaces';
import  User  from '../../modules/user/user.model';
import { sendEmail } from '../../modules/email/email.service';

export default class ReportService {
  private reportModel: Model<ReportModal>;
  private generateFilterReport: Function;

  constructor(reportModel: Model<ReportModal>, generateFilterReports: Function) {
    this.reportModel = reportModel;
    this.generateFilterReport = generateFilterReports;
  }

  private getNextScheduleDate(frequency?: string): Date {
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
  }

  async createReport(data: ICreateReport) {
    const report = await this.generateFilterReport(data.workspace, data.process, data.site, data.status);
    const users = await User.find({ _id: { $in: data.assignUsers } });
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
    
    const nextScheduleDate = this.getNextScheduleDate(data?.scheduleFrequency);
    const newReport = new this.reportModel({
      name: data.name,
      schedule: data.schedule,
      scheduleFrequency: data.scheduleFrequency,
      assignUsers: data.assignUsers,
      createdBy: new mongoose.Types.ObjectId(data.createdBy),
      workspace: new mongoose.Types.ObjectId(data.workspace),
      process: new mongoose.Types.ObjectId(data.process),
      site: new mongoose.Types.ObjectId(data.site),
      status: data.status || 'pending',
      lastSchedule: new Date(),
      nextSchedule: nextScheduleDate,
    });
    
    return await newReport.save();
  }

  async getReportById(reportId: string) {
    const report = await this.reportModel
      .findById(reportId)
      .populate("process")
      .populate('site')
      .populate("assignUsers", "name email profilePicture")
      .populate('createdBy', 'name email profilePicture');
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }

  async getReportsByWorkspace(workspaceId: string, page = 1, limit = 10) {
    const match = { workspace: new mongoose.Types.ObjectId(workspaceId), isDeleted: { $ne: true } };
    const total = await this.reportModel.countDocuments(match);
    const data = await this.reportModel
      .find(match)
      .populate("process", "name")
      .populate('site', 'name')
      .populate("assignUsers", "name email profilePicture")
      .populate('createdBy', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    return { 
      data, 
      total, 
      page, 
      limit,
      success: true,
      message: 'Reports retrieved successfully'
    };
  }

  async updateReport(reportId: string, data: Partial<ICreateReport>) {
    console.log('Updating report:', reportId, data);

    const updateData: any = { ...data };
    
    // Convert string IDs to ObjectIds where necessary
    if (data.createdBy) {
      updateData.createdBy = new mongoose.Types.ObjectId(data.createdBy);
    }
    if (data.workspace) {
      updateData.workspace = new mongoose.Types.ObjectId(data.workspace);
    }
    if (data.process) {
      updateData.process = new mongoose.Types.ObjectId(data.process);
    }
    if (data.site) {
      updateData.site = new mongoose.Types.ObjectId(data.site);
    }

    // Update next schedule if frequency changed
    if (data.scheduleFrequency) {
      updateData.nextSchedule = this.getNextScheduleDate(data.scheduleFrequency);
    }

    const report = await this.reportModel.findByIdAndUpdate(reportId, updateData, { new: true });
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }

  async deleteReport(reportId: string) {
    const report = await this.reportModel.findByIdAndDelete(reportId);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }

  async deleteReportMedia(reportId: string) {
    const report = await this.reportModel.findByIdAndUpdate(
      reportId, 
      { isDeleted: true }, 
      { new: true }
    );
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }

  async getReportsByStatus(status: string, page = 1, limit = 10) {
    const match = { status, isDeleted: { $ne: true } };
    const total = await this.reportModel.countDocuments(match);
    const data = await this.reportModel
      .find(match)
      .populate("process", "name")
      .populate('site', 'name')
      .populate("assignUsers", "name email profilePicture")
      .populate('createdBy', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      
    return { data, total, page, limit };
  }

  async getScheduledReports() {
    const now = new Date();
    return await this.reportModel
      .find({
        schedule: true,
        nextSchedule: { $lte: now },
        isDeleted: { $ne: true }
      })
      .populate("assignUsers", "name email")
      .populate('createdBy', 'name email');
  }
}

// For backward compatibility, export utility function
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
       
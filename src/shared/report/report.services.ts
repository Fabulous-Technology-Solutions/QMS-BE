import mongoose, { Model } from 'mongoose';
import { ICreateReport, ReportModal } from './report.interfaces';

import { sendEmail } from '../../modules/email/email.service';
import { AccountModel } from '../../modules/account';

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
    const report = await this.generateFilterReport(data.workspace, data.sites, data.processes, data.statuses);
    console.log('Generated report:', report);
    const users = await AccountModel.aggregate([
      { $match: { _id: { $in: data?.assignUsers?.map((id) => new mongoose.Types.ObjectId(id)) } } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { email: 1, name: 1, profilePicture: 1 } }],
        },
      },
      { $unwind: '$user' },
      { $project: { email: '$user.email', name: '$user.name', profilePicture: '$user.profilePicture', _id: 1 } },
    ]);
    const emailAddresses = users.map((user) => user.email);
    console.log('Email addresses:', emailAddresses);
    if (emailAddresses && emailAddresses.length > 0 && report?.Location) {
      await sendEmail(
        emailAddresses.join(',') || '<default_email@example.com>',
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
      processes: data?.processes?.map((process) => new mongoose.Types.ObjectId(process)),
      sites: data?.sites?.map((site) => new mongoose.Types.ObjectId(site)),
      statuses: data?.statuses || ['pending'],
      lastSchedule: new Date(),
      nextSchedule: nextScheduleDate,
    });

    return await newReport.save();
  }
  async getReportById(reportId: string) {
    const report = await this.reportModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(reportId) } },
      {
        $lookup: {
          from: 'processes',
          localField: 'process',
          foreignField: '_id',
          as: 'process',
        },
      },
      { $unwind: { path: '$process', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'sites',
          localField: 'site',
          foreignField: '_id',
          as: 'site',
        },
      },
      { $unwind: { path: '$site', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'accounts',
          localField: 'assignUsers',
          foreignField: '_id',
          as: 'assignUsers',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { email: 1, name: 1, profilePicture: 1 } }],
              },
            },
            { $unwind: '$user' },
            { $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture' } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    ]);

    if (!report || report.length === 0) {
      throw new Error('Report not found');
    }

    return report[0];
  }

  async getReportsByWorkspace(workspaceId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const result = await this.reportModel.aggregate([
      { $match: { workspace: new mongoose.Types.ObjectId(workspaceId), isDeleted: { $ne: true } } },
      {
        $lookup: {
          from: 'processes',
          localField: 'processes',
          foreignField: '_id',
          as: 'processes',
          pipeline: [{ $project: { _id:1,name: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'sites',
          localField: 'sites',
          foreignField: '_id',
          as: 'sites',
          pipeline: [{ $project: { _id:1,name: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'assignUsers',
          foreignField: '_id',
          as: 'assignUsers',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { email: 1, name: 1, profilePicture: 1 } }],
              },
            },
            { $unwind: '$user' },
            { $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture' } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]);
    const data = result[0].data;
    const total = result[0].total.length > 0 ? result[0].total[0].count : 0;

    return {
      data,
      total,
      page,
      limit,
      success: true,
      message: 'Reports retrieved successfully',
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
    if (data?.processes) {
      updateData.processes = data.processes.map((process) => new mongoose.Types.ObjectId(process));
    }
    if (data?.sites) {
      updateData.sites = data.sites.map((site) => new mongoose.Types.ObjectId(site));
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
    const report = await this.reportModel.findByIdAndUpdate(reportId, { isDeleted: true }, { new: true });

    if (!report) {
      throw new Error('Report not found');
    }

    return report;
  }

  async getReportsByStatus(status: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const result = await this.reportModel.aggregate([
      { $match: { status, isDeleted: { $ne: true } } },
      {
        $lookup: {
          from: 'processes',
          localField: 'process',
          foreignField: '_id',
          as: 'process',
        },
      },
      { $unwind: { path: '$process', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'sites',
          localField: 'site',
          foreignField: '_id',
          as: 'site',
        },
      },
      { $unwind: { path: '$site', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'accounts',
          localField: 'assignUsers',
          foreignField: '_id',
          as: 'assignUsers',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { email: 1, name: 1, profilePicture: 1 } }],
              },
            },
            { $unwind: '$user' },
             { $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture' } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = result[0].data;
    const total = result[0].total.length > 0 ? result[0].total[0].count : 0;

    return {
      data,
      total,
      page,
      limit,
      success: true,
      message: 'Reports retrieved successfully',
    };
  }

  async getScheduledReports() {
    const now = new Date();
    const result = await this.reportModel.aggregate([
      {
        $match: {
          schedule: true,
          nextSchedule: { $lte: now },
          isDeleted: { $ne: true },
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'assignUsers',
          foreignField: '_id',
          as: 'assignUsers',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { email: 1, name: 1, profilePicture: 1 } }],
              },
            },
            { $unwind: '$user' },
            { $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture' } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [{ $project: { name: 1, email: 1 } }],
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    ]);

    return result;
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

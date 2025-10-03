"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextScheduleDate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const email_service_1 = require("../../modules/email/email.service");
const account_1 = require("../../modules/account");
class ReportService {
    constructor(reportModel, generateFilterReports) {
        this.reportModel = reportModel;
        this.generateFilterReport = generateFilterReports;
    }
    getNextScheduleDate(frequency) {
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
    async createReport(data) {
        const report = await this.generateFilterReport(data.workspace, data.site, data.process, data.status);
        console.log('Generated report:', report);
        const users = await account_1.AccountModel.aggregate([
            { $match: { _id: { $in: data?.assignUsers?.map((id) => new mongoose_1.default.Types.ObjectId(id)) } } },
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
            await (0, email_service_1.sendEmail)(emailAddresses.join(',') || '<default_email@example.com>', `Report Generated: ${data.name}`, '', `<p>Dear User,</p>
        <p>The report has been successfully generated.</p>
        <p>You can download the report using the link below:</p>
        <p><a href="${report?.Location}">Download Report</a></p>
        <p>Best regards,<br/>QMS Team</p>`);
        }
        const nextScheduleDate = this.getNextScheduleDate(data?.scheduleFrequency);
        const newReport = new this.reportModel({
            name: data.name,
            schedule: data.schedule,
            scheduleFrequency: data.scheduleFrequency,
            assignUsers: data.assignUsers,
            createdBy: new mongoose_1.default.Types.ObjectId(data.createdBy),
            workspace: new mongoose_1.default.Types.ObjectId(data.workspace),
            process: new mongoose_1.default.Types.ObjectId(data.process),
            site: new mongoose_1.default.Types.ObjectId(data.site),
            status: data.status || 'pending',
            lastSchedule: new Date(),
            nextSchedule: nextScheduleDate,
        });
        return await newReport.save();
    }
    async getReportById(reportId) {
        const report = await this.reportModel.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(reportId) } },
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
    async getReportsByWorkspace(workspaceId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const result = await this.reportModel.aggregate([
            { $match: { workspace: new mongoose_1.default.Types.ObjectId(workspaceId), isDeleted: { $ne: true } } },
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
    async updateReport(reportId, data) {
        console.log('Updating report:', reportId, data);
        const updateData = { ...data };
        // Convert string IDs to ObjectIds where necessary
        if (data.createdBy) {
            updateData.createdBy = new mongoose_1.default.Types.ObjectId(data.createdBy);
        }
        if (data.workspace) {
            updateData.workspace = new mongoose_1.default.Types.ObjectId(data.workspace);
        }
        if (data.process) {
            updateData.process = new mongoose_1.default.Types.ObjectId(data.process);
        }
        if (data.site) {
            updateData.site = new mongoose_1.default.Types.ObjectId(data.site);
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
    async deleteReport(reportId) {
        const report = await this.reportModel.findByIdAndDelete(reportId);
        if (!report) {
            throw new Error('Report not found');
        }
        return report;
    }
    async deleteReportMedia(reportId) {
        const report = await this.reportModel.findByIdAndUpdate(reportId, { isDeleted: true }, { new: true });
        if (!report) {
            throw new Error('Report not found');
        }
        return report;
    }
    async getReportsByStatus(status, page = 1, limit = 10) {
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
exports.default = ReportService;
// For backward compatibility, export utility function
const getNextScheduleDate = (frequency) => {
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
exports.getNextScheduleDate = getNextScheduleDate;

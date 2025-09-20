"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextScheduleDate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
const email_service_1 = require("../../modules/email/email.service");
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
        const users = await user_model_1.default.find({ _id: { $in: data.assignUsers } });
        const emailAddresses = users.map(user => user.email);
        console.log('Email addresses:', emailAddresses);
        if (emailAddresses && emailAddresses.length > 0 && report?.Location) {
            await (0, email_service_1.sendEmail)(emailAddresses.join(',') || "<default_email@example.com>", `Report Generated: ${data.name}`, '', `<p>Dear User,</p>
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
    async getReportsByWorkspace(workspaceId, page = 1, limit = 10) {
        const match = { workspace: new mongoose_1.default.Types.ObjectId(workspaceId), isDeleted: { $ne: true } };
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

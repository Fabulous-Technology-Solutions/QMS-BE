"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReportMedia = exports.deleteReport = exports.updateReport = exports.getReportsByWorkspace = exports.getReportById = exports.createReport = exports.getNextScheduleDate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const report_modal_1 = __importDefault(require("./report.modal"));
const capalibrary_service_1 = require("../capalibrary/capalibrary.service");
const email_service_1 = require("../../../email/email.service");
const user_model_1 = __importDefault(require("../../../user/user.model"));
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
const createReport = async (data) => {
    const report = await (0, capalibrary_service_1.generateFilterReport)(data.workspace, data.process, data.site, data.status);
    const users = await user_model_1.default.find({ _id: { $in: data.assignUsers } });
    const emailAddresses = users.map(user => user.email);
    if (emailAddresses && emailAddresses.length > 0 && report?.Location) {
        await (0, email_service_1.sendEmail)(emailAddresses.join(',') || "<default_email@example.com>", `Report Generated: ${data.name}`, '', `<p>Dear User,</p>
      <p>The report has been successfully generated.</p>
      <p>You can download the report using the link below:</p>
      <p><a href="${report?.Location}">Download Report</a></p>
      <p>Best regards,<br/>QMS Team</p>`);
    }
    const nextScheduleDate = (0, exports.getNextScheduleDate)(data?.scheduleFrequency);
    const newReport = new report_modal_1.default({
        name: data.name,
        schedule: data.schedule,
        scheduleFrequency: data.scheduleFrequency,
        assignUsers: data.assignUsers,
        createdBy: new mongoose_1.default.Types.ObjectId(data.createdBy),
        workspace: new mongoose_1.default.Types.ObjectId(data.workspace),
        process: new mongoose_1.default.Types.ObjectId(data.process),
        site: new mongoose_1.default.Types.ObjectId(data.site),
        status: data.status || 'pending',
        lastSchedule: Date.now(),
        nextSchedule: nextScheduleDate,
    });
    return await newReport.save();
};
exports.createReport = createReport;
const getReportById = async (reportId) => {
    const report = await report_modal_1.default.findById(reportId).populate("process").populate('site').populate("assignUsers", "name email profilePicture").populate('createdBy', 'name email profilePicture');
    return report;
};
exports.getReportById = getReportById;
const getReportsByWorkspace = async (workspaceId, page = 1, limit = 10) => {
    const match = { workspace: new mongoose_1.default.Types.ObjectId(workspaceId) };
    const total = await report_modal_1.default.countDocuments(match);
    const data = await report_modal_1.default.find(match).populate("process").populate('site').populate("assignUsers", "name email profilePicture").populate('createdBy', 'name email profilePicture')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return { data, total, page, limit };
};
exports.getReportsByWorkspace = getReportsByWorkspace;
const updateReport = async (reportId, data) => {
    const report = await report_modal_1.default.findByIdAndUpdate(reportId, data, { new: false });
    return report;
};
exports.updateReport = updateReport;
const deleteReport = async (reportId) => {
    const report = await report_modal_1.default.findByIdAndDelete(reportId, {});
    if (!report) {
        throw new Error('Report not found');
    }
    return report;
};
exports.deleteReport = deleteReport;
const deleteReportMedia = async (reportId) => {
    const report = await report_modal_1.default.findByIdAndUpdate(reportId, { isDeleted: true }, { new: true });
    if (!report) {
        throw new Error('Report not found');
    }
    return report;
};
exports.deleteReportMedia = deleteReportMedia;

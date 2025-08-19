"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReportMedia = exports.deleteReport = exports.updateReport = exports.getReportsByLibrary = exports.getReportsByWorkspace = exports.getReportById = exports.createReport = exports.getNextScheduleDate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const report_modal_1 = __importDefault(require("./report.modal"));
const capalibrary_service_1 = require("../capalibrary/capalibrary.service");
const email_service_1 = require("../../../email/email.service");
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
    const report = await (0, capalibrary_service_1.generateReport)(data.library);
    if (data.scheduleEmails && data.scheduleEmails.length > 0 && report?.Location) {
        await (0, email_service_1.sendEmail)(data.scheduleEmails.join(',') || "<default_email@example.com>", `Report Generated: ${data.name}`, '', `<p>Dear User,</p>
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
        scheduleEmails: data.scheduleEmails,
        createdBy: new mongoose_1.default.Types.ObjectId(data.createdBy),
        workspace: new mongoose_1.default.Types.ObjectId(data.workspace),
        library: new mongoose_1.default.Types.ObjectId(data.library),
        lastSchedule: Date.now(),
        nextSchedule: nextScheduleDate,
    });
    return await newReport.save();
};
exports.createReport = createReport;
const getReportById = async (reportId) => {
    const report = await report_modal_1.default.findById(reportId).populate('createdBy');
    return report;
};
exports.getReportById = getReportById;
const getReportsByWorkspace = async (workspaceId, page = 1, limit = 10) => {
    const match = { workspace: new mongoose_1.default.Types.ObjectId(workspaceId) };
    const total = await report_modal_1.default.countDocuments(match);
    const data = await report_modal_1.default.find(match).populate('library', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy');
    return { data, total, page, limit };
};
exports.getReportsByWorkspace = getReportsByWorkspace;
const getReportsByLibrary = async (libraryId, page = 1, limit = 10) => {
    const match = { library: new mongoose_1.default.Types.ObjectId(libraryId) };
    const total = await report_modal_1.default.countDocuments(match);
    const data = await report_modal_1.default.find(match).populate('library', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy');
    return { data, total, page, limit };
};
exports.getReportsByLibrary = getReportsByLibrary;
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeScheduledReports = void 0;
const report_modal_1 = __importDefault(require("../capa/workspace/report/report.modal"));
const capalibrary_service_1 = require("../capa/workspace/capalibrary/capalibrary.service");
const email_service_1 = require("../email/email.service");
const report_services_1 = require("../capa/workspace/report/report.services");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("./catchAsync"));
exports.executeScheduledReports = (0, catchAsync_1.default)(async (_, res) => {
    console.log('⏳ Cron Job Started: Generating scheduled reports');
    try {
        // Get current date at 00:00:00 and next date at 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dueReports = await report_modal_1.default.find({
            nextSchedule: { $gte: today, $lt: tomorrow },
        }).populate("process").populate('site').populate("assignUsers", "name email profilePicture").populate('createdBy', 'name email profilePicture');
        const processedReports = [];
        for (const report of dueReports) {
            console.log(`📊 Generating report: ${report.name}`);
            try {
                // Generate report
                const generated = await (0, capalibrary_service_1.generateFilterReport)(report?.workspace?.toString(), report?.process?.toString(), report?.site?.toString(), report?.status);
                const emailAddresses = report?.assignUsers?.map(user => user.email) || [];
                // Send email if needed
                if ((emailAddresses?.length ?? 0) > 0 && generated?.Location) {
                    await (0, email_service_1.sendEmail)(emailAddresses.join(","), `Report Generated: ${report.name}`, "", `<p>Dear User,</p>
              <p>The report <b>${report.name}</b> has been successfully generated.</p>
              <p>You can download the report here: 
              <a href="${generated?.Location}">Download Report</a></p>
              <p>Best regards,<br/>QMS Team</p>`);
                }
                // Update schedule
                const nextScheduleDate = (0, report_services_1.getNextScheduleDate)(report.scheduleFrequency);
                report.lastSchedule = new Date();
                report.nextSchedule = nextScheduleDate;
                await report.save();
                console.log(`✅ Report updated: ${report.name}`);
                processedReports.push({
                    id: report._id,
                    name: report.name,
                    status: 'success',
                    emailsSent: emailAddresses.length
                });
            }
            catch (reportError) {
                console.error(`❌ Error processing report ${report.name}:`, reportError);
                processedReports.push({
                    id: report._id,
                    name: report.name,
                    status: 'error',
                    error: reportError.message
                });
            }
        }
        console.log('🎉 Cron Job Completed Successfully');
        return res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Cron job completed successfully',
            processedReports,
            totalReports: dueReports.length
        });
    }
    catch (error) {
        console.error('❌ Cron Job Error:', error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Cron job failed',
            error: error.message
        });
    }
});

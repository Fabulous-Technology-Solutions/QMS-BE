"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const report_modal_1 = __importDefault(require("../capa/workspace/report/report.modal"));
const capalibrary_service_1 = require("../capa/workspace/capalibrary/capalibrary.service");
const email_service_1 = require("../email/email.service");
const report_services_1 = require("../../shared/report/report.services");
// Cron: runs every day at 00:00
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("⏳ Cron Job Started: Generating scheduled reports");
    try {
        // Fetch reports that are due
        // Get current date at 00:00:00 and next date at 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dueReports = await report_modal_1.default.find({
            nextSchedule: { $gte: today, $lt: tomorrow },
        }).populate("process").populate('site').populate("assignUsers", "name email profilePicture").populate('createdBy', 'name email profilePicture');
        for (const report of dueReports) {
            console.log(`📊 Generating report: ${report.name}`);
            // Generate report
            const generated = await (0, capalibrary_service_1.generateFilterReport)(report?.workspace?.toString(), report?.sites?.map(site => site.toString()) || [], report?.processes?.map(process => process.toString()) || [], report?.statuses?.map(status => status.toString()) || []);
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
        }
        console.log("🎉 Cron Job Completed Successfully");
    }
    catch (error) {
        console.error("❌ Cron Job Error:", error);
    }
});

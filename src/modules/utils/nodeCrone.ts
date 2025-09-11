import cron from "node-cron";
import ReportModel from "../capa/workspace/report/report.modal";
import { generateFilterReport } from "../capa/workspace/capalibrary/capalibrary.service";
import { sendEmail } from "../email/email.service";
import { getNextScheduleDate } from "../../shared/report/report.services";
import { IUserDoc } from "../user/user.interfaces";

// Cron: runs every day at 00:00
cron.schedule("0 0 * * *", async (): Promise<void> => {
  console.log("⏳ Cron Job Started: Generating scheduled reports");

  try {
    // Fetch reports that are due
    // Get current date at 00:00:00 and next date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dueReports = await ReportModel.find({
      nextSchedule: { $gte: today, $lt: tomorrow },
    }).populate("process").populate('site').populate("assignUsers","name email profilePicture").populate('createdBy','name email profilePicture');

    for (const report of dueReports) {
      console.log(`📊 Generating report: ${report.name}`);

      // Generate report
      const generated = await generateFilterReport(report?.workspace?.toString(), report?.process?.toString(), report?.site?.toString(), report?.status);
      const emailAddresses = ((report?.assignUsers as unknown) as IUserDoc[])?.map(user => user.email) || [];

      // Send email if needed
      if ((emailAddresses?.length ?? 0) > 0 && generated?.Location) {
        await sendEmail(
          emailAddresses.join(","),
          `Report Generated: ${report.name}`,
          "",
          `<p>Dear User,</p>
            <p>The report <b>${report.name}</b> has been successfully generated.</p>
            <p>You can download the report here: 
            <a href="${generated?.Location}">Download Report</a></p>
            <p>Best regards,<br/>QMS Team</p>`
        );
      }

      // Update schedule
      const nextScheduleDate = getNextScheduleDate(report.scheduleFrequency);
      report.lastSchedule = new Date();
      report.nextSchedule = nextScheduleDate;

      await report.save();
      console.log(`✅ Report updated: ${report.name}`);
    }

    console.log("🎉 Cron Job Completed Successfully");
  } catch (error) {
    console.error("❌ Cron Job Error:", error);
  }
});

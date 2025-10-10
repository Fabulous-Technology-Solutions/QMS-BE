import { Request, Response } from 'express';
import ReportModel from '../capa/workspace/report/report.modal';
import { generateFilterReport } from '../capa/workspace/capalibrary/capalibrary.service';
import { sendEmail } from '../email/email.service';

import { IUserDoc } from '../user/user.interfaces';
import httpStatus from 'http-status';
import catchAsync from './catchAsync';
import { getNextScheduleDate } from '../../shared/report/report.services';

interface ProcessedReport {
  id: any;
  name: string;
  status: 'success' | 'error';
  emailsSent?: number;
  error?: string;
}

export const executeScheduledReports = catchAsync(async (_: Request, res: Response) => {
  console.log('⏳ Cron Job Started: Generating scheduled reports');

  try {
    // Get current date at 00:00:00 and next date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dueReports = await ReportModel.find({
      nextSchedule: { $gte: today, $lt: tomorrow },
    }).populate("process").populate('site').populate("assignUsers","name email profilePicture").populate('createdBy','name email profilePicture');

    const processedReports: ProcessedReport[] = [];

    for (const report of dueReports) {
      console.log(`📊 Generating report: ${report.name}`);

      try {
        // Generate report
        const generated = await generateFilterReport(
          report?.workspace?.toString(), 
          report?.sites?.map(site => site.toString()) || [], 
          report?.processes?.map(process => process.toString()) || [], 
          report?.statuses
        );
        
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

        processedReports.push({
          id: report._id,
          name: report.name,
          status: 'success',
          emailsSent: emailAddresses.length
        });
      } catch (reportError: any) {
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
    
    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Cron job completed successfully',
      processedReports,
      totalReports: dueReports.length
    });

  } catch (error: any) {
    console.error('❌ Cron Job Error:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Cron job failed',
      error: error.message
    });
  }
});

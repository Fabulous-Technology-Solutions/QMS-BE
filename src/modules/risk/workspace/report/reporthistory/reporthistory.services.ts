import ReportHistoryModel from './reporthistory.modal';
import { generateReport } from '../../library/risklibrary.service';

const createReportHistory = async (libraryId: string) => {
  const report = await generateReport(libraryId);
  const reportHistory = new ReportHistoryModel({ library: libraryId, file: report.Location, fileKey: report.Key });
  await reportHistory.save();
  return {
    success: true,
    message: 'Preview created successfully',
    data: reportHistory
  };
};


export { createReportHistory };
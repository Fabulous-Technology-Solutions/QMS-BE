import mongoose from 'mongoose';
import {ReportModal  } from  "../../../../shared/report/report.interfaces"
import reportSchema from '../../../../shared/report/report.schema';
const ReportModel = mongoose.model<ReportModal>('Report', reportSchema);
export default ReportModel;

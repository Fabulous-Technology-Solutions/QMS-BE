import mongoose from 'mongoose';
import {ReportModal  } from  "./report.interfaces"

const reportSchema = new mongoose.Schema<ReportModal>({
  name: { type: String, required: true },
  schedule: { type: Boolean, default: false },
  scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
  scheduleEmails: { type: [String] },
  nextSchedule: { type: Date },
  lastSchedule: { type: Date },
  library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Capaworkspace', required: true },
  isDeleted: { type: Boolean, default: false },
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


const ReportModel = mongoose.model<ReportModal>('Report', reportSchema);
export default ReportModel;

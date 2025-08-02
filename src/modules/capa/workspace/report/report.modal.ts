import mongoose from 'mongoose';
import {ReportModal  } from  "./report.interfaces"

const reportSchema = new mongoose.Schema<ReportModal>({
  name: { type: String, required: true },
  type: { type: String, enum: ['summary', 'effectiveness', 'department', 'closure', 'overdue'], required: true },
  format: { type: String, enum: ['pdf', 'both', 'xlsx'], required: true },
  schedule: { type: Boolean, default: false },
  scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
  scheduleEmails: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 5'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  site: { type: String },
  department: { type: String },
  docfile: { type: String },
  dockey: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Capaworkspace', required: true },
  isDeleted: { type: Boolean, default: false },
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

function arrayLimit(val: string[]) {
  return val.length <= 15;
}

const ReportModel = mongoose.model<ReportModal>('Report', reportSchema);
export default ReportModel;

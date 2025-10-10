import mongoose from 'mongoose';
import {ReportModal  } from  "./report.interfaces"

const reportSchema = new mongoose.Schema<ReportModal>({
  name: { type: String, required: true },
  schedule: { type: Boolean, default: false },
  scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
  statuses:[ { type: String }],
  assignUsers: { type: [mongoose.Schema.Types.ObjectId], ref: 'Account' },
  nextSchedule: { type: Date },
  lastSchedule: { type: Date },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
  processes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Process' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  isDeleted: { type: Boolean, default: false }, 
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default reportSchema;
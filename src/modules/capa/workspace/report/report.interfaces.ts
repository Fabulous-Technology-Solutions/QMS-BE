import mongoose, { Document } from 'mongoose';

export interface ReportModal extends Document {
  name: string;
  schedule: boolean;
  scheduleFrequency?: string;
  scheduleEmails?: string[];
  createdBy: mongoose.Schema.Types.ObjectId;
  workspace: mongoose.Schema.Types.ObjectId;
  library: mongoose.Schema.Types.ObjectId;
  isDeleted?: boolean;
  lastSchedule: Date;
  nextSchedule: Date;
}

export interface ICreateReport {
  name: string;
  schedule: boolean;
  scheduleFrequency?: string;
  scheduleEmails?: string[];
  createdBy: string;
  workspace: string;
  isDeleted?: boolean;
  library: string;
}

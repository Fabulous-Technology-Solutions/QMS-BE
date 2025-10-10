import mongoose, { Document } from 'mongoose';

export interface ReportModal extends Document {
  name: string;
  schedule: boolean;
  scheduleFrequency?: string;
  assignUsers?: mongoose.Schema.Types.ObjectId[];
  createdBy: mongoose.Schema.Types.ObjectId;
  workspace: mongoose.Schema.Types.ObjectId;
  processes: mongoose.Schema.Types.ObjectId[];
  sites: mongoose.Schema.Types.ObjectId[];
  statuses: string[];
  isDeleted?: boolean;
  lastSchedule: Date;
  nextSchedule: Date;
}

export interface ICreateReport {
  name: string;
  schedule: boolean;
  scheduleFrequency?: string;
  assignUsers?: string[];
  createdBy: string;
  workspace: string;
  isDeleted?: boolean;
  processes?: string[];
  statuses?: string[];
  sites?: string[];
}

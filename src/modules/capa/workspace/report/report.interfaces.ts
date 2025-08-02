import mongoose, { Document } from 'mongoose';

export interface ReportModal extends Document {
  name: string;
  type: string;
  format: string;
  schedule: boolean;
  scheduleFrequency?: string;
  scheduleEmails?: string[];
  startDate?: Date;
  endDate?: Date;
  site?: string;
  department?: string;
  docfile?: string;
  dockey?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  workspace: mongoose.Schema.Types.ObjectId;
  isDeleted?: boolean;
}

export interface ICreateReport {
  name: string;
  type: string;
  format: string;
  schedule: boolean;
  scheduleFrequency?: string;
  scheduleEmails?: string[];
  startDate?: Date;
  endDate?: Date;
  site?: string;
  department?: string;
  docfile?: string;
  dockey?: string;
  createdBy: string;
  workspace: string;
  isDeleted?: boolean;
}

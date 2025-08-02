import mongoose, { Document } from 'mongoose';

export interface ActionModel extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  status: string;
  assignedTo: mongoose.Types.ObjectId[];
  priority: string;
  type: string;
  endDate: Date;
  startDate: Date;
  library: mongoose.Types.ObjectId;
  docfile?: string;
  docfileKey?: string;
  cause?: mongoose.Types.ObjectId; // Reference to Causes
}

export interface CreateActionRequest {
  name: string;
  description: string;
  createdBy: string;
  status: string;
  assignedTo?: string[];
  priority?: string;
  type?: string;
  endDate?: Date;
  startDate?: Date;
  library: string;
  docfile?: string;
  docfileKey?: string;
  cause?: string; // Reference to Causes
}


export interface ActionMatchQuery {
  _id: mongoose.Types.ObjectId | string;
  isDeleted: boolean;
  assignedTo?: { $in: mongoose.Types.ObjectId[] };
}
import { Document, ObjectId } from 'mongoose';

export interface ProcessModal extends Document {
  name: string;
  location: string;
  parentSite: ObjectId[];
  note: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedBy?: ObjectId;
  deletedAt?: Date;
  modules?: ObjectId[];
  subProcesses?: string[];
  status?: boolean;
}
export interface createProcess {
  name?: string;
  location?: string;
  parentSite?: string[];
  note?: string;
  createdBy?: ObjectId;
  modules?: string[];
  status?: boolean;
}

export interface ProcessQuery {
  _id?: string;
  createdBy?: ObjectId | undefined;
  parentSite?: string;
  modules?: { $in: string[] };
  name?: { $regex: string; $options: string };
  status?: boolean;
  acrossMultipleSites?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

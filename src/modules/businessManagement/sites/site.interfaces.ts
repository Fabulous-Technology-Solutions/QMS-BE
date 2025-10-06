import { Document, ObjectId } from "mongoose";

export interface SiteModal extends Document {
  name: string;
  location: string;
  timeZone: string; 
  note: string;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedBy?: ObjectId;
  deletedAt?: Date;
  modules?: ObjectId[];
  status?: boolean;
}

export interface createSite {
  name?: string;
  location?: string;
  timeZone?: string;
  note?: string;
  createdBy?: ObjectId;
  modules?: string[];
  status?: boolean;
}

export interface SiteQuery {
  _id?: string;
  createdBy?: ObjectId | undefined;
  modules?: { $in: string[] };
  name?: { $regex: string; $options: string };
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
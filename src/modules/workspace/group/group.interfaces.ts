import mongoose, { Document } from 'mongoose';

export interface IGroupModal extends Document {
  name: string;
  description: string;
  workspace: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  isDeleted: boolean;
  members: mongoose.Schema.Types.ObjectId[];
  status: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  workspace: string;
  members: string[];
  status: string;
  createdBy: string;
}

export interface GetGroupsQuery {
  workspace: string;
  isDeleted?: boolean;
  name?: { $regex: string; $options: string };
}


export interface GetGroupsParams {
  workspace: string;
  page: number;
  limit: number;
  search?: string;
}
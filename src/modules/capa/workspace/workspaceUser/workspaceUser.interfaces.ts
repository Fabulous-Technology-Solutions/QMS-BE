import { IUser } from '@/modules/user/user.interfaces';
import mongoose from 'mongoose';

export interface IUserWithWorkspace extends IUser {
  workspace: mongoose.Schema.Types.ObjectId;
  roleId: mongoose.Schema.Types.ObjectId;
}

export interface IWorkspaceUserDoc extends IUserWithWorkspace, mongoose.Document {}

export interface CreateWorkspaceUserRequest {
  workspace: string;
  roleId: string;
  name: string;
  email: string;
  status: string;
  profilePicture?: string;
  profilePictureKey?: string;
}

export interface IUpdateWorkspaceUserRequest extends CreateWorkspaceUserRequest {
  userId: mongoose.Schema.Types.ObjectId;
}

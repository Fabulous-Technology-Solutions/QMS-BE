import mongoose, { Document } from 'mongoose';
export interface Iaccount {
  role: 'admin' | 'workspaceUser' | 'standardUser';
  workspaceRole?: 'admin' | 'view' | 'edit';
 Permissions?: Array<{
    permission: string;
    workspace: string;
  }>;
  accountId?: string;
  user: string;
  status: 'active' | 'inactive';
}

export interface IaccountDoc extends Document {
  status: 'active' | 'inactive';
  role: 'admin' | 'workspaceUser' | 'standardUser';
  workspaceRole?: 'admin' | 'view' | 'edit';
  Permissions?: Array<{
    permission: string;
    workspace: mongoose.Types.ObjectId;
  }>;
  accountId?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

import mongoose, { Document } from 'mongoose';
export interface Invitation {
  email: string;
  role: 'admin' | 'workspaceUser' | 'standardUser';

   Permissions?: Array<{
    permission: string;
    workspace: mongoose.Types.ObjectId;
  }>;
  accountId?: string;
  status: 'pending' | 'accepted';
  token: string;
  invitedBy: string;
}

export interface InvitationDoc extends Document {
  email: string;
  role: 'admin' | 'workspaceUser' | 'standardUser';

  Permissions?: Array<{
    permission: string;
    workspace: mongoose.Types.ObjectId;
  }>;
  accountId?: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted';
  token: string;
  invitedBy: mongoose.Types.ObjectId;
}

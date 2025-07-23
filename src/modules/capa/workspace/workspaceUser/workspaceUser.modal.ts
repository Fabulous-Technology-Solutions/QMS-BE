import { IWorkspaceUserDoc, IUserWithWorkspace } from './workspaceUser.interfaces';
import User from '../../../user/user.model';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<IWorkspaceUserDoc>(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Capaworkspace',
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const workspaceUser = User.discriminator<IUserWithWorkspace>('workspaceUser', userSchema);

export default workspaceUser;

import { InvitationDoc } from './invitation.interfces';
import mongoose, { model, Schema } from 'mongoose';
const invitationSchema = new Schema<InvitationDoc>(
  {
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'workspaceUser', 'standardUser'], required: true },
    Permissions: [
      {
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        permission: { type: String, enum: ['admin', 'view', 'edit'], default: 'view' },
      },
    ],
    status: { type: String, enum: ['pending', 'accepted'], required: true },
    token: { type: String, required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: false },
  },
  { timestamps: true }
);

const InvitationModel = model<InvitationDoc>('Invitation', invitationSchema);
export default InvitationModel;

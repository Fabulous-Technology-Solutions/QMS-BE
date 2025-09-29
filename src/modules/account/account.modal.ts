import { IaccountDoc } from './account.interfaces';
import mongoose, { model, Schema } from 'mongoose';
const accountSchema = new Schema<IaccountDoc>(
  {
    role: { type: String, enum: ['admin', 'workspaceUser'], required: true },
    Permissions: [
      {
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
        permission: { type: String, enum: ['admin', 'view', 'edit'], default: 'view' },
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: false },
      },
    ],
    status: { type: String, enum: ['active', 'inactive'], required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true  
    }
  },
  { timestamps: true }
);
  
const AccountModel = model<IaccountDoc>('Account', accountSchema);
export default AccountModel;

import { IModalNotificationSetting } from './notificationSetting.interfaces.js';
import mongoose, { Schema } from 'mongoose';
const NotificationSettingSchema: Schema = new Schema(
  {
    workspaceId: { type: mongoose.Types.ObjectId, required: true, unique: true },
    enableNotifications: { type: Boolean, default: true },
    taskassign: { type: Boolean, default: true },
    taskdeadline: { type: Boolean, default: true },
    taskcompleted: { type: Boolean, default: true },
    newprojectassigned: { type: Boolean, default: true },
    projectdeadline: { type: Boolean, default: true },
    projectcompleted: { type: Boolean, default: true },
    mentationchat: { type: Boolean, default: true },
    directmessage: { type: Boolean, default: true },
    actionplanoverdue: { type: Boolean, default: true },
    actionoverdueafter: { type: Number, default: 1 },
    actionoverdueunit: { type: String, enum: ['months', 'days', 'weeks'], default: 'days' },
    createaction: { type: Boolean, default: true },
    actionplandue: { type: Boolean, default: true },
    actiondeadline: { type: Boolean, default: true },
    pendingapprovalreminder: { type: Boolean, default: true },
    approvalreminderafter: { type: Number, default: 1 },
    approvalreminderunit: { type: String, enum: ['months', 'days', 'weeks'], default: 'days' },
    newapprovalrequest: { type: Boolean, default: true },
    approvalchangestatus: { type: Boolean, default: true },
    approvalescalation: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
 const  NotificationSettingModal = mongoose.model<IModalNotificationSetting>(
  'NotificationSetting',
  NotificationSettingSchema
);

export default NotificationSettingModal;

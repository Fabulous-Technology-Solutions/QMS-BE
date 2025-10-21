import { Document, ObjectId } from 'mongoose';

export interface IModalNotificationSetting extends Document {
  workspaceId: ObjectId;
  enableNotifications: boolean;
  taskassign: boolean;
  taskdeadline: boolean;
  taskcompleted: boolean;
  newprojectassigned: boolean;
  projectdeadline: boolean;
  projectcompleted: boolean;
  mentationchat: boolean;
  directmessage: boolean;
  actionplanoverdue: boolean;
  actionoverdueafter: number;
  actionoverdueunit: string;
  createaction: boolean;
  actionplandue: boolean;
  actiondeadline: boolean;
  pendingapprovalreminder: boolean;
  approvalreminderafter: number;
  approvalreminderunit: string;
  newapprovalrequest: boolean;
  approvalchangestatus: boolean;
  approvalescalation: boolean;
}



export interface INotificationSettingResponse {
  workspaceId?: string;
  enableNotifications?: boolean;
  taskassign?: boolean;
  taskdeadline?: boolean;
  taskcompleted?: boolean;
  newprojectassigned?: boolean;
  projectdeadline?: boolean;
  projectcompleted?: boolean;
  mentationchat?: boolean;
  directmessage?: boolean;
  actionplanoverdue?: boolean;
  actionoverdueafter?: number;
  actionoverdueunit?: string;
  createaction?: boolean;
  actionplandue?: boolean;
  actiondeadline?: boolean;
  pendingapprovalreminder?: boolean;
  approvalreminderafter?: number;
  approvalreminderunit?: string;
  newapprovalrequest?: boolean;
  approvalchangestatus?: boolean;
  approvalescalation?: boolean;
}
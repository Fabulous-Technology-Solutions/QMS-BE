import Joi from 'joi';
import { INotificationSettingResponse } from './notificationSetting.interfaces.js';

const notificationSettingSchema : Record<keyof INotificationSettingResponse, Joi.Schema> = {
  workspaceId: Joi.string().optional(),
  enableNotifications: Joi.boolean().default(true),
    taskassign: Joi.boolean().default(true),
    taskdeadline: Joi.boolean().default(true),
    taskcompleted: Joi.boolean().default(true),
    newprojectassigned: Joi.boolean().default(true),
    projectdeadline: Joi.boolean().default(true),
    projectcompleted: Joi.boolean().default(true),
    mentationchat: Joi.boolean().default(true),
    directmessage: Joi.boolean().default(true),
    actionplanoverdue: Joi.boolean().default(true),
    actionoverdueafter: Joi.number().default(1),
    actionoverdueunit: Joi.string().valid('months', 'days', 'weeks').default('days'),
    createaction: Joi.boolean().default(true),
    actionplandue: Joi.boolean().default(true),
    actiondeadline: Joi.boolean().default(true),
    pendingapprovalreminder: Joi.boolean().default(true),   
    approvalreminderafter: Joi.number().default(1),
    approvalreminderunit: Joi.string().valid('months', 'days', 'weeks').default('days'),
    newapprovalrequest: Joi.boolean().default(true),
  approvalchangestatus: Joi.boolean().default(true),
  approvalescalation: Joi.boolean().default(true),
};

export const createOrUpdateNotificationSettingValidation = {
    body: Joi.object(notificationSettingSchema),
}
export const updateNotificationSettingValidation = {
    body: Joi.object(notificationSettingSchema)
}
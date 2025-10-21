"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationSettingValidation = exports.createOrUpdateNotificationSettingValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const notificationSettingSchema = {
    workspaceId: joi_1.default.string().optional(),
    enableNotifications: joi_1.default.boolean().default(true),
    taskassign: joi_1.default.boolean().default(true),
    taskdeadline: joi_1.default.boolean().default(true),
    taskcompleted: joi_1.default.boolean().default(true),
    newprojectassigned: joi_1.default.boolean().default(true),
    projectdeadline: joi_1.default.boolean().default(true),
    projectcompleted: joi_1.default.boolean().default(true),
    mentationchat: joi_1.default.boolean().default(true),
    directmessage: joi_1.default.boolean().default(true),
    actionplanoverdue: joi_1.default.boolean().default(true),
    actionoverdueafter: joi_1.default.number().default(1),
    actionoverdueunit: joi_1.default.string().valid('months', 'days', 'weeks').default('days'),
    createaction: joi_1.default.boolean().default(true),
    actionplandue: joi_1.default.boolean().default(true),
    actiondeadline: joi_1.default.boolean().default(true),
    pendingapprovalreminder: joi_1.default.boolean().default(true),
    approvalreminderafter: joi_1.default.number().default(1),
    approvalreminderunit: joi_1.default.string().valid('months', 'days', 'weeks').default('days'),
    newapprovalrequest: joi_1.default.boolean().default(true),
    approvalchangestatus: joi_1.default.boolean().default(true),
    approvalescalation: joi_1.default.boolean().default(true),
};
exports.createOrUpdateNotificationSettingValidation = {
    body: joi_1.default.object(notificationSettingSchema),
};
exports.updateNotificationSettingValidation = {
    body: joi_1.default.object(notificationSettingSchema)
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startActionDeadlineReminderCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const action_modal_1 = __importDefault(require("./action.modal"));
const account_modal_1 = __importDefault(require("../../../../account/account.modal"));
const notification_services_1 = require("../../../../notification/notification.services");
/**
 * Cron Job: Action Deadline Reminder
 * Runs every hour to check for actions with approaching deadlines
 * and sends reminder notifications to assigned users
 */
const startActionDeadlineReminderCron = () => {
    // Cron: runs every hour at minute 0 - Send deadline reminder notifications for CAPA actions
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('⏰ Cron Job Started: Checking CAPA action deadlines');
        try {
            // Get current date and time
            const now = new Date();
            const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
            // Find actions that:
            // 1. Are not deleted
            // 2. Are not completed
            // 3. Have an end date between now and 24 hours from now (to send reminder once per day)
            const pendingDeadlineActions = await action_modal_1.default.find({
                isDeleted: false,
                status: { $ne: 'completed' },
                endDate: { $gte: now, $lte: oneDayLater },
            })
                .populate('library')
                .populate({
                path: 'library',
                populate: {
                    path: 'workspace',
                    select: 'name _id moduleId',
                },
            });
            console.log(`📋 Found ${pendingDeadlineActions.length} actions with upcoming deadlines`);
            for (const action of pendingDeadlineActions) {
                if (!action.assignedTo || action.assignedTo.length === 0) {
                    continue; // Skip if no one is assigned
                }
                // Get all assigned accounts
                const assignedAccounts = await account_modal_1.default.find({
                    _id: { $in: action.assignedTo },
                }).populate('user', 'name email _id');
                // Send notification to each assigned user
                for (const account of assignedAccounts) {
                    if (!account.user?._id)
                        continue;
                    const hoursRemaining = Math.ceil((action.endDate.getTime() - now.getTime()) / (1000 * 60 * 60));
                    const daysRemaining = Math.ceil((action.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    let timeRemaining = '';
                    if (hoursRemaining < 1) {
                        timeRemaining = 'less than 1 hour';
                    }
                    else if (hoursRemaining < 24) {
                        timeRemaining = `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}`;
                    }
                    else {
                        timeRemaining = `${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`;
                    }
                    console.log(`workspace ID: ${action?.library?.workspace}`);
                    const notificationParams = {
                        userId: account.user._id,
                        title: 'Task Deadline Reminder',
                        message: `⏰ Reminder: The task "${action.name}" in ${action.library?.name || 'a library'} is due in ${timeRemaining}`,
                        type: 'task',
                        notificationFor: 'Action',
                        forId: action._id,
                        sendEmailNotification: true,
                        accountId: account._id,
                        subId: account.accountId,
                        link: `/capa/${action?.library?.workspace?.moduleId?.toString() || ''}/workspace/${action?.library?.workspace?._id?.toString() || ''}/my-tasks`,
                    };
                    try {
                        (0, notification_services_1.createNotification)(notificationParams, action.library?.workspace?._id.toString() || '', 'taskdeadline');
                        console.log(`✅ Deadline reminder sent to ${account.user?.email} for task: ${action.name}`);
                    }
                    catch (notificationError) {
                        console.error(`❌ Failed to send notification for task ${action._id}:`, notificationError);
                    }
                }
            }
            console.log('🎉 Deadline Reminder Cron Job Completed Successfully');
        }
        catch (error) {
            console.error('❌ Deadline Reminder Cron Job Error:', error);
        }
    });
};
exports.startActionDeadlineReminderCron = startActionDeadlineReminderCron;

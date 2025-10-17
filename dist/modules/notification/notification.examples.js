"use strict";
/**
 * Notification Usage Examples
 *
 * This file contains practical examples of how to use the notification system
 * in different parts of your application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyWorkspaceMembers = exports.sendCustomNotificationsToMultipleUsers = exports.sendNotificationIfEnabled = exports.sendNotificationWithErrorHandling = exports.sendTemplateNotification = exports.notifyNewReview = exports.notifyPayoutProcessed = exports.notifyTeamOfTaskAssignment = exports.notifyBookingConfirmation = exports.notifyUserOfNewMessage = void 0;
const index_1 = require("./index");
// ============================================
// Example 1: Send notification after chat message
// ============================================
async function notifyUserOfNewMessage(recipientId, senderName, messagePreview) {
    return await (0, index_1.sendNotificationToUser)({
        userId: recipientId,
        title: 'New Message',
        message: `${senderName}: ${messagePreview}`,
        type: index_1.NotificationTypes.MESSAGE
    });
}
exports.notifyUserOfNewMessage = notifyUserOfNewMessage;
// ============================================
// Example 2: Notify user of booking confirmation
// ============================================
async function notifyBookingConfirmation(userId, serviceName, bookingDate) {
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: 'Booking Confirmed',
        message: `Your booking for "${serviceName}" on ${bookingDate.toLocaleDateString()} has been confirmed`,
        type: index_1.NotificationTypes.BOOKING
    });
}
exports.notifyBookingConfirmation = notifyBookingConfirmation;
// ============================================
// Example 3: Notify team members of task assignment
// ============================================
async function notifyTeamOfTaskAssignment(teamMemberIds, taskName, assignedBy) {
    return await (0, index_1.sendNotificationToMultipleUsers)(teamMemberIds, 'New Task Assignment', `${assignedBy} assigned you to task: "${taskName}"`, index_1.NotificationTypes.USER);
}
exports.notifyTeamOfTaskAssignment = notifyTeamOfTaskAssignment;
// ============================================
// Example 4: Notify user of payment/payout
// ============================================
async function notifyPayoutProcessed(userId, amount, currency = 'USD', accountId) {
    const params = {
        userId,
        title: 'Payout Processed',
        message: `Your payout of ${currency} ${amount.toFixed(2)} has been successfully processed`,
        type: index_1.NotificationTypes.PAYOUT
    };
    if (accountId) {
        params.accountId = accountId;
    }
    return await (0, index_1.sendNotificationToUser)(params);
}
exports.notifyPayoutProcessed = notifyPayoutProcessed;
// ============================================
// Example 5: Notify user of new review
// ============================================
async function notifyNewReview(userId, reviewerName, rating, serviceName) {
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: 'New Review Received',
        message: `${reviewerName} left a ${rating}-star review for your service "${serviceName}"`,
        type: index_1.NotificationTypes.REVIEW
    });
}
exports.notifyNewReview = notifyNewReview;
// ============================================
// Example 6: Using notification templates
// ============================================
async function sendTemplateNotification(userId, templateType, ...args) {
    let template;
    switch (templateType) {
        case 'message':
            template = index_1.NotificationTemplates.newMessage(args[0]); // senderName
            break;
        case 'booking':
            template = index_1.NotificationTemplates.newBooking(args[0]); // serviceName
            break;
        case 'review':
            template = index_1.NotificationTemplates.newReview(args[0]); // rating
            break;
        case 'payout':
            template = index_1.NotificationTemplates.payoutProcessed(args[0], args[1]); // amount, currency
            break;
        default:
            throw new Error('Invalid template type');
    }
    return await (0, index_1.sendNotificationToUser)({
        userId,
        ...template
    });
}
exports.sendTemplateNotification = sendTemplateNotification;
// ============================================
// Example 7: Notify with error handling
// ============================================
async function sendNotificationWithErrorHandling(userId, title, message, type) {
    try {
        const result = await (0, index_1.sendNotificationToUser)({
            userId,
            title,
            message,
            type
        });
        if (!result.success) {
            console.error('Failed to send notification:', result.message);
            return { success: false, error: result.message };
        }
        console.log('Notification sent successfully:', result.notification);
        return { success: true, notification: result.notification };
    }
    catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
    }
}
exports.sendNotificationWithErrorHandling = sendNotificationWithErrorHandling;
// ============================================
// Example 8: Conditional notification based on user preferences
// ============================================
async function sendNotificationIfEnabled(userId, title, message, type, getUserPreferences) {
    // Check user preferences (you would implement this function)
    const preferences = await getUserPreferences(userId);
    if (!preferences.notificationsEnabled) {
        console.log('Notifications disabled for user:', userId);
        return { success: false, message: 'Notifications disabled' };
    }
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title,
        message,
        type
    });
}
exports.sendNotificationIfEnabled = sendNotificationIfEnabled;
// ============================================
// Example 9: Batch notification with different messages
// ============================================
async function sendCustomNotificationsToMultipleUsers(notifications) {
    const promises = notifications.map(notification => (0, index_1.sendNotificationToUser)(notification));
    return await Promise.allSettled(promises);
}
exports.sendCustomNotificationsToMultipleUsers = sendCustomNotificationsToMultipleUsers;
// ============================================
// Example 10: Notify workspace members
// ============================================
async function notifyWorkspaceMembers(workspaceId, title, message, getMemberIds) {
    // Get all member IDs from workspace (you would implement this function)
    const memberIds = await getMemberIds(workspaceId);
    if (memberIds.length === 0) {
        return { success: false, message: 'No members found in workspace' };
    }
    return await (0, index_1.sendNotificationToMultipleUsers)(memberIds, title, message, index_1.NotificationTypes.USER);
}
exports.notifyWorkspaceMembers = notifyWorkspaceMembers;

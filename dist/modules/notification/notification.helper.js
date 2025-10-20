"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplates = exports.NotificationTypes = exports.sendNotificationToMultipleUsers = exports.sendNotificationToUser = void 0;
const notification_services_1 = require("./notification.services");
/**
 * Helper function to send a notification to a user
 * Can be used anywhere in the codebase
 *
 * @param params - Notification parameters
 * @param sendEmail - Whether to send email notification (default: false)
 * @returns Promise with success status and notification data
 *
 * @example
 * ```typescript
 * import { sendNotificationToUser } from '@/modules/notification/notification.helper';
 *
 * // Send a message notification without email
 * await sendNotificationToUser({
 *   userId: 'user_id_123',
 *   title: 'New Message',
 *   message: 'You have a new message from John',
 *   type: 'message'
 * });
 *
 * // Send a booking notification with email
 * await sendNotificationToUser({
 *   userId: 'user_id_456',
 *   title: 'New Booking',
 *   message: 'You have a new booking request',
 *   type: 'booking',
 *   accountId: 'account_id_789',
 *   sendEmailNotification: true
 * });
 * ```
 */
const sendNotificationToUser = async (params) => {
    return await (0, notification_services_1.createNotification)(params);
};
exports.sendNotificationToUser = sendNotificationToUser;
/**
 * Helper function to send notifications to multiple users
 *
 * @param userIds - Array of user IDs to send notification to
 * @param title - Notification title
 * @param message - Notification message
 * @param type - Notification type
 * @param accountId - Optional account ID
 * @param sendEmailNotification - Whether to send email notification (default: false)
 * @returns Promise with array of results
 *
 * @example
 * ```typescript
 * import { sendNotificationToMultipleUsers } from '@/modules/notification/notification.helper';
 *
 * // Send notification without email
 * await sendNotificationToMultipleUsers(
 *   ['user_id_1', 'user_id_2', 'user_id_3'],
 *   'Team Update',
 *   'New task assigned to your team',
 *   'user'
 * );
 *
 * // Send notification with email
 * await sendNotificationToMultipleUsers(
 *   ['user_id_1', 'user_id_2'],
 *   'Important Update',
 *   'Please review the new policy',
 *   'user',
 *   undefined,
 *   true
 * );
 * ```
 */
const sendNotificationToMultipleUsers = async (userIds, title, message, type, accountId, sendEmailNotification = false) => {
    const promises = userIds.map((userId) => {
        const params = {
            userId,
            title,
            message,
            type,
            sendEmailNotification,
        };
        if (accountId) {
            params.accountId = accountId;
        }
        return (0, notification_services_1.createNotification)(params);
    });
    return await Promise.allSettled(promises);
};
exports.sendNotificationToMultipleUsers = sendNotificationToMultipleUsers;
/**
 * Notification type constants for easy reference
 */
exports.NotificationTypes = {
    SERVICE_LISTING: 'serviceListing',
    BOOKING: 'booking',
    USER: 'user',
    REVIEW: 'review',
    MESSAGE: 'message',
    PAYOUT: 'payout',
};
/**
 * Pre-configured notification templates
 */
exports.NotificationTemplates = {
    newMessage: (senderName) => ({
        title: 'New Message',
        message: `You have a new message from ${senderName}`,
        type: exports.NotificationTypes.MESSAGE,
    }),
    newBooking: (serviceName) => ({
        title: 'New Booking',
        message: `You have a new booking request for ${serviceName}`,
        type: exports.NotificationTypes.BOOKING,
    }),
    bookingConfirmed: (serviceName) => ({
        title: 'Booking Confirmed',
        message: `Your booking for ${serviceName} has been confirmed`,
        type: exports.NotificationTypes.BOOKING,
    }),
    newReview: (rating) => ({
        title: 'New Review',
        message: `You received a ${rating}-star review`,
        type: exports.NotificationTypes.REVIEW,
    }),
    payoutProcessed: (amount, currency = 'USD') => ({
        title: 'Payout Processed',
        message: `Your payout of ${currency} ${amount} has been processed`,
        type: exports.NotificationTypes.PAYOUT,
    }),
    accountUpdate: (updateType) => ({
        title: 'Account Update',
        message: `Your account ${updateType} has been updated`,
        type: exports.NotificationTypes.USER,
    }),
};

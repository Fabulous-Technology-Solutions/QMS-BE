"use strict";
/**
 * Email Notification Examples
 *
 * This file demonstrates how to use email notifications
 * with the notification system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDeadlineReminder = exports.sendWelcomeNotification = exports.sendUrgentNotification = exports.sendNotificationWithUserPreference = exports.sendBulkAnnouncementWithEmail = exports.sendServiceListingApproval = exports.sendScheduledReminder = exports.sendReviewNotificationWithEmail = exports.sendCriticalSystemAlert = exports.sendTeamEmailNotification = exports.sendPaymentNotificationWithEmail = exports.sendBookingConfirmationWithEmail = exports.sendImportantAlert = void 0;
const index_1 = require("./index");
// ============================================
// Example 1: Send Important Alert with Email
// ============================================
async function sendImportantAlert(userId, alertMessage) {
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: 'Important Alert',
        message: alertMessage,
        type: index_1.NotificationTypes.USER,
        sendEmailNotification: true // 📧 Sends email
    });
}
exports.sendImportantAlert = sendImportantAlert;
// ============================================
// Example 2: Booking Confirmation with Email
// ============================================
async function sendBookingConfirmationWithEmail(userId, bookingDetails, accountId) {
    const params = {
        userId,
        title: 'Booking Confirmed',
        message: `Your booking has been confirmed: ${bookingDetails}`,
        type: index_1.NotificationTypes.BOOKING,
        sendEmailNotification: true
    };
    if (accountId) {
        params.accountId = accountId;
    }
    return await (0, index_1.sendNotificationToUser)(params);
}
exports.sendBookingConfirmationWithEmail = sendBookingConfirmationWithEmail;
// ============================================
// Example 3: Payment Notification with Email
// ============================================
async function sendPaymentNotificationWithEmail(userId, amount, currency = 'USD') {
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: 'Payment Processed',
        message: `Your payment of ${currency} ${amount.toFixed(2)} has been processed successfully.`,
        type: index_1.NotificationTypes.PAYOUT,
        sendEmailNotification: true
    });
}
exports.sendPaymentNotificationWithEmail = sendPaymentNotificationWithEmail;
// ============================================
// Example 4: Team Notification with Email to All
// ============================================
async function sendTeamEmailNotification(teamMemberIds, subject, message) {
    return await (0, index_1.sendNotificationToMultipleUsers)(teamMemberIds, subject, message, index_1.NotificationTypes.USER, undefined, // no accountId
    true // sendEmailNotification: true
    );
}
exports.sendTeamEmailNotification = sendTeamEmailNotification;
// ============================================
// Example 5: Critical System Alert (Email Only to Online Users)
// ============================================
async function sendCriticalSystemAlert(userIds, alertTitle, alertMessage) {
    const promises = userIds.map(userId => (0, index_1.sendNotificationToUser)({
        userId,
        title: alertTitle,
        message: alertMessage,
        type: index_1.NotificationTypes.USER,
        sendEmailNotification: true // All users get email
    }));
    const results = await Promise.allSettled(promises);
    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    console.log(`Alert sent: ${successful} succeeded, ${failed} failed`);
    return results;
}
exports.sendCriticalSystemAlert = sendCriticalSystemAlert;
// ============================================
// Example 6: Review Notification (Socket + Email)
// ============================================
async function sendReviewNotificationWithEmail(userId, reviewerName, rating, comment) {
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: 'New Review Received',
        message: `${reviewerName} left you a ${rating}-star review: "${comment.substring(0, 100)}..."`,
        type: index_1.NotificationTypes.REVIEW,
        sendEmailNotification: true
    });
}
exports.sendReviewNotificationWithEmail = sendReviewNotificationWithEmail;
// ============================================
// Example 7: Scheduled Reminder with Email
// ============================================
async function sendScheduledReminder(userId, reminderTitle, reminderMessage, eventDate) {
    const message = `${reminderMessage}\n\nScheduled for: ${eventDate.toLocaleString()}`;
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: reminderTitle,
        message,
        type: index_1.NotificationTypes.USER,
        sendEmailNotification: true
    });
}
exports.sendScheduledReminder = sendScheduledReminder;
// ============================================
// Example 8: Service Listing Approval (Email Required)
// ============================================
async function sendServiceListingApproval(userId, serviceName, approved) {
    const title = approved ? 'Service Approved' : 'Service Requires Changes';
    const message = approved
        ? `Congratulations! Your service "${serviceName}" has been approved and is now live.`
        : `Your service "${serviceName}" requires some changes before approval. Please check the details.`;
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title,
        message,
        type: index_1.NotificationTypes.SERVICE_LISTING,
        sendEmailNotification: true // Important updates always get email
    });
}
exports.sendServiceListingApproval = sendServiceListingApproval;
// ============================================
// Example 9: Bulk Announcement with Email
// ============================================
async function sendBulkAnnouncementWithEmail(allUserIds, announcementTitle, announcementBody) {
    console.log(`Sending announcement to ${allUserIds.length} users...`);
    // Process in batches of 50 to avoid overwhelming the email server
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < allUserIds.length; i += batchSize) {
        batches.push(allUserIds.slice(i, i + batchSize));
    }
    const allResults = [];
    for (const batch of batches) {
        const batchResults = await (0, index_1.sendNotificationToMultipleUsers)(batch, announcementTitle, announcementBody, index_1.NotificationTypes.USER, undefined, true // Send email to all
        );
        allResults.push(...(await Promise.allSettled([Promise.resolve(batchResults)])));
        // Wait 1 second between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log(`Announcement sent to all users`);
    return allResults;
}
exports.sendBulkAnnouncementWithEmail = sendBulkAnnouncementWithEmail;
// ============================================
// Example 10: Conditional Email Based on User Preference
// ============================================
async function sendNotificationWithUserPreference(userId, title, message, type, getUserEmailPreference) {
    // Check if user wants email notifications
    const wantsEmail = await getUserEmailPreference(userId);
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title,
        message,
        type,
        sendEmailNotification: wantsEmail
    });
}
exports.sendNotificationWithUserPreference = sendNotificationWithUserPreference;
// ============================================
// Example 11: Urgent Notification (Always Email)
// ============================================
async function sendUrgentNotification(userId, urgentMessage, accountId) {
    const params = {
        userId,
        title: '🚨 URGENT: Immediate Action Required',
        message: urgentMessage,
        type: index_1.NotificationTypes.USER,
        sendEmailNotification: true
    };
    if (accountId) {
        params.accountId = accountId;
    }
    return await (0, index_1.sendNotificationToUser)(params);
}
exports.sendUrgentNotification = sendUrgentNotification;
// ============================================
// Example 12: Welcome Email for New Users
// ============================================
async function sendWelcomeNotification(userId, userName) {
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: 'Welcome to QMS!',
        message: `Hi ${userName}, welcome to our platform! We're excited to have you here. Get started by completing your profile.`,
        type: index_1.NotificationTypes.USER,
        sendEmailNotification: true
    });
}
exports.sendWelcomeNotification = sendWelcomeNotification;
// ============================================
// Example 13: Deadline Reminder with Email
// ============================================
async function sendDeadlineReminder(userId, taskName, hoursRemaining) {
    const urgency = hoursRemaining <= 24 ? '🚨 URGENT: ' : '';
    return await (0, index_1.sendNotificationToUser)({
        userId,
        title: `${urgency}Deadline Approaching`,
        message: `Your task "${taskName}" is due in ${hoursRemaining} hours. Please complete it soon.`,
        type: index_1.NotificationTypes.USER,
        sendEmailNotification: hoursRemaining <= 24 // Email only if urgent
    });
}
exports.sendDeadlineReminder = sendDeadlineReminder;
// ============================================
// Usage in Application
// ============================================
/*
// After user completes a booking
await sendBookingConfirmationWithEmail(
  userId,
  'Room 101, Check-in: 2025-10-25',
  accountId
);

// Team announcement
await sendTeamEmailNotification(
  ['user1', 'user2', 'user3'],
  'Team Meeting Tomorrow',
  'Don't forget about our team meeting at 10 AM tomorrow'
);

// Important payment update
await sendPaymentNotificationWithEmail(
  userId,
  150.00,
  'USD'
);

// Critical system alert to all admins
await sendCriticalSystemAlert(
  adminUserIds,
  'System Maintenance Scheduled',
  'System will be down for maintenance on Sunday from 2-4 AM'
);
*/

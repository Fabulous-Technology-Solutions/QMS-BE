/**
 * Email Notification Examples
 * 
 * This file demonstrates how to use email notifications
 * with the notification system.
 */

import { 
  sendNotificationToUser, 
  sendNotificationToMultipleUsers,
  NotificationTypes 
} from './index';

// ============================================
// Example 1: Send Important Alert with Email
// ============================================
export async function sendImportantAlert(
  userId: string,
  alertMessage: string
) {
  return await sendNotificationToUser({
    userId,
    title: 'Important Alert',
    message: alertMessage,
    type: NotificationTypes.USER,
    sendEmailNotification: true  // 📧 Sends email
  });
}

// ============================================
// Example 2: Booking Confirmation with Email
// ============================================
export async function sendBookingConfirmationWithEmail(
  userId: string,
  bookingDetails: string,
  accountId?: string
) {
  const params: any = {
    userId,
    title: 'Booking Confirmed',
    message: `Your booking has been confirmed: ${bookingDetails}`,
    type: NotificationTypes.BOOKING,
    sendEmailNotification: true
  };

  if (accountId) {
    params.accountId = accountId;
  }

  return await sendNotificationToUser(params);
}

// ============================================
// Example 3: Payment Notification with Email
// ============================================
export async function sendPaymentNotificationWithEmail(
  userId: string,
  amount: number,
  currency: string = 'USD'
) {
  return await sendNotificationToUser({
    userId,
    title: 'Payment Processed',
    message: `Your payment of ${currency} ${amount.toFixed(2)} has been processed successfully.`,
    type: NotificationTypes.PAYOUT,
    sendEmailNotification: true
  });
}

// ============================================
// Example 4: Team Notification with Email to All
// ============================================
export async function sendTeamEmailNotification(
  teamMemberIds: string[],
  subject: string,
  message: string
) {
  return await sendNotificationToMultipleUsers(
    teamMemberIds,
    subject,
    message,
    NotificationTypes.USER,
    undefined,  // no accountId
    true        // sendEmailNotification: true
  );
}

// ============================================
// Example 5: Critical System Alert (Email Only to Online Users)
// ============================================
export async function sendCriticalSystemAlert(
  userIds: string[],
  alertTitle: string,
  alertMessage: string
) {
  const promises = userIds.map(userId => 
    sendNotificationToUser({
      userId,
      title: alertTitle,
      message: alertMessage,
      type: NotificationTypes.USER,
      sendEmailNotification: true  // All users get email
    })
  );

  const results = await Promise.allSettled(promises);
  
  // Log results
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`Alert sent: ${successful} succeeded, ${failed} failed`);
  
  return results;
}

// ============================================
// Example 6: Review Notification (Socket + Email)
// ============================================
export async function sendReviewNotificationWithEmail(
  userId: string,
  reviewerName: string,
  rating: number,
  comment: string
) {
  return await sendNotificationToUser({
    userId,
    title: 'New Review Received',
    message: `${reviewerName} left you a ${rating}-star review: "${comment.substring(0, 100)}..."`,
    type: NotificationTypes.REVIEW,
    sendEmailNotification: true
  });
}

// ============================================
// Example 7: Scheduled Reminder with Email
// ============================================
export async function sendScheduledReminder(
  userId: string,
  reminderTitle: string,
  reminderMessage: string,
  eventDate: Date
) {
  const message = `${reminderMessage}\n\nScheduled for: ${eventDate.toLocaleString()}`;
  
  return await sendNotificationToUser({
    userId,
    title: reminderTitle,
    message,
    type: NotificationTypes.USER,
    sendEmailNotification: true
  });
}

// ============================================
// Example 8: Service Listing Approval (Email Required)
// ============================================
export async function sendServiceListingApproval(
  userId: string,
  serviceName: string,
  approved: boolean
) {
  const title = approved ? 'Service Approved' : 'Service Requires Changes';
  const message = approved 
    ? `Congratulations! Your service "${serviceName}" has been approved and is now live.`
    : `Your service "${serviceName}" requires some changes before approval. Please check the details.`;

  return await sendNotificationToUser({
    userId,
    title,
    message,
    type: NotificationTypes.SERVICE_LISTING,
    sendEmailNotification: true  // Important updates always get email
  });
}

// ============================================
// Example 9: Bulk Announcement with Email
// ============================================
export async function sendBulkAnnouncementWithEmail(
  allUserIds: string[],
  announcementTitle: string,
  announcementBody: string
) {
  console.log(`Sending announcement to ${allUserIds.length} users...`);
  
  // Process in batches of 50 to avoid overwhelming the email server
  const batchSize = 50;
  const batches: string[][] = [];
  
  for (let i = 0; i < allUserIds.length; i += batchSize) {
    batches.push(allUserIds.slice(i, i + batchSize));
  }
  
  const allResults = [];
  
  for (const batch of batches) {
    const batchResults = await sendNotificationToMultipleUsers(
      batch,
      announcementTitle,
      announcementBody,
      NotificationTypes.USER,
      undefined,
      true  // Send email to all
    );
    
    allResults.push(...(await Promise.allSettled([Promise.resolve(batchResults)])));
    
    // Wait 1 second between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Announcement sent to all users`);
  return allResults;
}

// ============================================
// Example 10: Conditional Email Based on User Preference
// ============================================
export async function sendNotificationWithUserPreference(
  userId: string,
  title: string,
  message: string,
  type: typeof NotificationTypes[keyof typeof NotificationTypes],
  getUserEmailPreference: (userId: string) => Promise<boolean>
) {
  // Check if user wants email notifications
  const wantsEmail = await getUserEmailPreference(userId);
  
  return await sendNotificationToUser({
    userId,
    title,
    message,
    type,
    sendEmailNotification: wantsEmail
  });
}

// ============================================
// Example 11: Urgent Notification (Always Email)
// ============================================
export async function sendUrgentNotification(
  userId: string,
  urgentMessage: string,
  accountId?: string
) {
  const params: any = {
    userId,
    title: '🚨 URGENT: Immediate Action Required',
    message: urgentMessage,
    type: NotificationTypes.USER,
    sendEmailNotification: true
  };

  if (accountId) {
    params.accountId = accountId;
  }

  return await sendNotificationToUser(params);
}

// ============================================
// Example 12: Welcome Email for New Users
// ============================================
export async function sendWelcomeNotification(
  userId: string,
  userName: string
) {
  return await sendNotificationToUser({
    userId,
    title: 'Welcome to QMS!',
    message: `Hi ${userName}, welcome to our platform! We're excited to have you here. Get started by completing your profile.`,
    type: NotificationTypes.USER,
    sendEmailNotification: true
  });
}

// ============================================
// Example 13: Deadline Reminder with Email
// ============================================
export async function sendDeadlineReminder(
  userId: string,
  taskName: string,
  hoursRemaining: number
) {
  const urgency = hoursRemaining <= 24 ? '🚨 URGENT: ' : '';
  
  return await sendNotificationToUser({
    userId,
    title: `${urgency}Deadline Approaching`,
    message: `Your task "${taskName}" is due in ${hoursRemaining} hours. Please complete it soon.`,
    type: NotificationTypes.USER,
    sendEmailNotification: hoursRemaining <= 24  // Email only if urgent
  });
}

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

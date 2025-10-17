/**
 * Notification Usage Examples
 * 
 * This file contains practical examples of how to use the notification system
 * in different parts of your application.
 */

import { 
  sendNotificationToUser, 
  sendNotificationToMultipleUsers,
  NotificationTypes,
  NotificationTemplates 
} from './index';

// ============================================
// Example 1: Send notification after chat message
// ============================================
export async function notifyUserOfNewMessage(
  recipientId: string,
  senderName: string,
  messagePreview: string
) {
  return await sendNotificationToUser({
    userId: recipientId,
    title: 'New Message',
    message: `${senderName}: ${messagePreview}`,
    type: NotificationTypes.MESSAGE
  });
}

// ============================================
// Example 2: Notify user of booking confirmation
// ============================================
export async function notifyBookingConfirmation(
  userId: string,
  serviceName: string,
  bookingDate: Date
) {
  return await sendNotificationToUser({
    userId,
    title: 'Booking Confirmed',
    message: `Your booking for "${serviceName}" on ${bookingDate.toLocaleDateString()} has been confirmed`,
    type: NotificationTypes.BOOKING
  });
}

// ============================================
// Example 3: Notify team members of task assignment
// ============================================
export async function notifyTeamOfTaskAssignment(
  teamMemberIds: string[],
  taskName: string,
  assignedBy: string
) {
  return await sendNotificationToMultipleUsers(
    teamMemberIds,
    'New Task Assignment',
    `${assignedBy} assigned you to task: "${taskName}"`,
    NotificationTypes.USER
  );
}

// ============================================
// Example 4: Notify user of payment/payout
// ============================================
export async function notifyPayoutProcessed(
  userId: string,
  amount: number,
  currency: string = 'USD',
  accountId?: string
) {
  const params: any = {
    userId,
    title: 'Payout Processed',
    message: `Your payout of ${currency} ${amount.toFixed(2)} has been successfully processed`,
    type: NotificationTypes.PAYOUT
  };

  if (accountId) {
    params.accountId = accountId;
  }

  return await sendNotificationToUser(params);
}

// ============================================
// Example 5: Notify user of new review
// ============================================
export async function notifyNewReview(
  userId: string,
  reviewerName: string,
  rating: number,
  serviceName: string
) {
  return await sendNotificationToUser({
    userId,
    title: 'New Review Received',
    message: `${reviewerName} left a ${rating}-star review for your service "${serviceName}"`,
    type: NotificationTypes.REVIEW
  });
}

// ============================================
// Example 6: Using notification templates
// ============================================
export async function sendTemplateNotification(
  userId: string,
  templateType: 'message' | 'booking' | 'review' | 'payout',
  ...args: any[]
) {
  let template;

  switch (templateType) {
    case 'message':
      template = NotificationTemplates.newMessage(args[0]); // senderName
      break;
    case 'booking':
      template = NotificationTemplates.newBooking(args[0]); // serviceName
      break;
    case 'review':
      template = NotificationTemplates.newReview(args[0]); // rating
      break;
    case 'payout':
      template = NotificationTemplates.payoutProcessed(args[0], args[1]); // amount, currency
      break;
    default:
      throw new Error('Invalid template type');
  }

  return await sendNotificationToUser({
    userId,
    ...template
  });
}

// ============================================
// Example 7: Notify with error handling
// ============================================
export async function sendNotificationWithErrorHandling(
  userId: string,
  title: string,
  message: string,
  type: typeof NotificationTypes[keyof typeof NotificationTypes]
) {
  try {
    const result = await sendNotificationToUser({
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
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Example 8: Conditional notification based on user preferences
// ============================================
export async function sendNotificationIfEnabled(
  userId: string,
  title: string,
  message: string,
  type: typeof NotificationTypes[keyof typeof NotificationTypes],
  getUserPreferences: (userId: string) => Promise<{ notificationsEnabled: boolean }>
) {
  // Check user preferences (you would implement this function)
  const preferences = await getUserPreferences(userId);

  if (!preferences.notificationsEnabled) {
    console.log('Notifications disabled for user:', userId);
    return { success: false, message: 'Notifications disabled' };
  }

  return await sendNotificationToUser({
    userId,
    title,
    message,
    type
  });
}

// ============================================
// Example 9: Batch notification with different messages
// ============================================
export async function sendCustomNotificationsToMultipleUsers(
  notifications: Array<{
    userId: string;
    title: string;
    message: string;
    type: typeof NotificationTypes[keyof typeof NotificationTypes];
    accountId?: string;
  }>
) {
  const promises = notifications.map(notification => 
    sendNotificationToUser(notification)
  );

  return await Promise.allSettled(promises);
}

// ============================================
// Example 10: Notify workspace members
// ============================================
export async function notifyWorkspaceMembers(
  workspaceId: string,
  title: string,
  message: string,
  getMemberIds: (workspaceId: string) => Promise<string[]>
) {
  // Get all member IDs from workspace (you would implement this function)
  const memberIds = await getMemberIds(workspaceId);

  if (memberIds.length === 0) {
    return { success: false, message: 'No members found in workspace' };
  }

  return await sendNotificationToMultipleUsers(
    memberIds,
    title,
    message,
    NotificationTypes.USER
  );
}

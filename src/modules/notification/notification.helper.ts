import { createNotification } from './notification.services';
import { ICreateNotificationParams } from './notification.interfaces';

/**
 * Helper function to send a notification to a user
 * Can be used anywhere in the codebase
 * 
 * @param params - Notification parameters
 * @returns Promise with success status and notification data
 * 
 * @example
 * ```typescript
 * import { sendNotificationToUser } from '@/modules/notification/notification.helper';
 * 
 * // Send a message notification
 * await sendNotificationToUser({
 *   userId: 'user_id_123',
 *   title: 'New Message',
 *   message: 'You have a new message from John',
 *   type: 'message'
 * });
 * 
 * // Send a booking notification with accountId
 * await sendNotificationToUser({
 *   userId: 'user_id_456',
 *   title: 'New Booking',
 *   message: 'You have a new booking request',
 *   type: 'booking',
 *   accountId: 'account_id_789'
 * });
 * ```
 */
export const sendNotificationToUser = async (
  params: ICreateNotificationParams
) => {
  return await createNotification(params);
};

/**
 * Helper function to send notifications to multiple users
 * 
 * @param userIds - Array of user IDs to send notification to
 * @param title - Notification title
 * @param message - Notification message
 * @param type - Notification type
 * @param accountId - Optional account ID
 * @returns Promise with array of results
 * 
 * @example
 * ```typescript
 * import { sendNotificationToMultipleUsers } from '@/modules/notification/notification.helper';
 * 
 * await sendNotificationToMultipleUsers(
 *   ['user_id_1', 'user_id_2', 'user_id_3'],
 *   'Team Update',
 *   'New task assigned to your team',
 *   'user'
 * );
 * ```
 */
export const sendNotificationToMultipleUsers = async (
  userIds: string[],
  title: string,
  message: string,
  type: ICreateNotificationParams['type'],
  accountId?: string
) => {
  const promises = userIds.map((userId) => {
    const params: ICreateNotificationParams = {
      userId,
      title,
      message,
      type,
    };
    
    if (accountId) {
      params.accountId = accountId;
    }
    
    return createNotification(params);
  });

  return await Promise.allSettled(promises);
};

/**
 * Notification type constants for easy reference
 */
export const NotificationTypes = {
  SERVICE_LISTING: 'serviceListing' as const,
  BOOKING: 'booking' as const,
  USER: 'user' as const,
  REVIEW: 'review' as const,
  MESSAGE: 'message' as const,
  PAYOUT: 'payout' as const,
};

/**
 * Pre-configured notification templates
 */
export const NotificationTemplates = {
  newMessage: (senderName: string) => ({
    title: 'New Message',
    message: `You have a new message from ${senderName}`,
    type: NotificationTypes.MESSAGE,
  }),

  newBooking: (serviceName: string) => ({
    title: 'New Booking',
    message: `You have a new booking request for ${serviceName}`,
    type: NotificationTypes.BOOKING,
  }),

  bookingConfirmed: (serviceName: string) => ({
    title: 'Booking Confirmed',
    message: `Your booking for ${serviceName} has been confirmed`,
    type: NotificationTypes.BOOKING,
  }),

  newReview: (rating: number) => ({
    title: 'New Review',
    message: `You received a ${rating}-star review`,
    type: NotificationTypes.REVIEW,
  }),

  payoutProcessed: (amount: number, currency: string = 'USD') => ({
    title: 'Payout Processed',
    message: `Your payout of ${currency} ${amount} has been processed`,
    type: NotificationTypes.PAYOUT,
  }),

  accountUpdate: (updateType: string) => ({
    title: 'Account Update',
    message: `Your account ${updateType} has been updated`,
    type: NotificationTypes.USER,
  }),
};

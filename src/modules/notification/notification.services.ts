import mongoose from 'mongoose';
import Notification from './notification.modal';
import {
  IGetUserNotificationsParams,
  IGetUserUnreadNotificationsParams,
  INotificationResponse,
  IReadUserNotificationsParams,
  ICreateNotificationParams,
} from './notification.interfaces';
import { getSocketInstance } from '../socket/socket.initialize';

export const createNotification = async (params: ICreateNotificationParams): Promise<INotificationResponse> => {
  try {
    const { userId, title, message, type, accountId } = params;

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    // Convert accountId to ObjectId if provided and is a string
    const accountObjectId = accountId
      ? typeof accountId === 'string'
        ? new mongoose.Types.ObjectId(accountId)
        : accountId
      : undefined;

    // Create new notification
    const notification = new Notification({
      userId: userObjectId,
      title,
      message,
      type,
      accountId: accountObjectId,
      isRead: false,
      isDelivered: false,
    });

    await notification.save();

    // Emit notification to user via socket if they are connected
    const io = getSocketInstance();
    if (io) {
      io.to(userObjectId.toString()).emit('new-notification', {
        success: true,
        notification: notification.toObject(),
      });
    }

    return {
      success: true,
      notification: notification.toObject(),
      message: 'Notification created and sent successfully',
    };
  } catch (error: any) {
    console.error('Error in createNotification:', error.message);
    return {
      success: false,
      message: error.message || 'Error creating notification',
    };
  }
};

export const getUserNotifications = async (params: IGetUserNotificationsParams): Promise<INotificationResponse> => {
  try {
    const { userId, page = 1, limit = 20 } = params;

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

    const skip = (validPage - 1) * validLimit;

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    // Get total count
    const total = await Notification.countDocuments({ userId: userObjectId });

    // Get paginated notifications
    const notifications = await Notification.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .lean();

    return {
      success: true,
      notifications,
      page: validPage,
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit),
    };
  } catch (error: any) {
    console.error('Error in getUserNotifications:', error.message);
    return {
      success: false,
      message: error.message || 'Error fetching notifications',
    };
  }
};

export const getUserUnreadNotifications = async (
  params: IGetUserUnreadNotificationsParams
): Promise<INotificationResponse> => {
  try {
    const { userId, accountId } = params;

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;



    const query: any = {
      userId: userObjectId,
      isRead: false,
    };
    if (accountId) {
      query.accountId = accountId;
    } else {
      query.accountId = { $exists: false };
    }

    console.log('Unread notifications query:', query);

    // Get unread notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      notifications,
      total: notifications.length,
    };
  } catch (error: any) {
    console.error('Error in getUserUnreadNotifications:', error.message);
    return {
      success: false,
      message: error.message || 'Error fetching unread notifications',
    };
  }
};

export const readUserNotifications = async (
  params: IReadUserNotificationsParams
): Promise<{ success: boolean; message?: string }> => {
  try {
    const { userId, accountId } = params;

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    // Build query based on accountId
    const query: any = {
      userId: userObjectId,
    };
    
    if (accountId) {
      query.accountId = accountId;
    } else {
      query.accountId = { $exists: false };
    }

    // Mark notifications as read based on query
    await Notification.updateMany(query, { $set: { isRead: true } });

    return { success: true };
  } catch (error: any) {
    console.error('Error in readUserNotifications:', error.message);
    return {
      success: false,
      message: error.message || 'Error marking notifications as read',
    };
  }
};

export const deleteUserNotifications = async (
  params: IReadUserNotificationsParams
): Promise<{ success: boolean; message?: string }> => {
  try {
    const { userId } = params;

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    // Delete all notifications
    await Notification.deleteMany({ userId: userObjectId });

    return { success: true };
  } catch (error: any) {
    console.error('Error in deleteUserNotifications:', error.message);
    return {
      success: false,
      message: error.message || 'Error deleting notifications',
    };
  }
};

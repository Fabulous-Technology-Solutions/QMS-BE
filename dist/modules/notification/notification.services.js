"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserNotifications = exports.readUserNotifications = exports.getUserUnreadNotifications = exports.getUserNotifications = exports.createNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notification_modal_1 = __importDefault(require("./notification.modal"));
const socket_initialize_1 = require("../socket/socket.initialize");
const createNotification = async (params) => {
    try {
        const { userId, title, message, type, accountId } = params;
        // Convert userId to ObjectId if it's a string
        const userObjectId = typeof userId === 'string' ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        // Convert accountId to ObjectId if provided and is a string
        const accountObjectId = accountId
            ? typeof accountId === 'string'
                ? new mongoose_1.default.Types.ObjectId(accountId)
                : accountId
            : undefined;
        // Create new notification
        const notification = new notification_modal_1.default({
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
        const io = (0, socket_initialize_1.getSocketInstance)();
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
    }
    catch (error) {
        console.error('Error in createNotification:', error.message);
        return {
            success: false,
            message: error.message || 'Error creating notification',
        };
    }
};
exports.createNotification = createNotification;
const getUserNotifications = async (params) => {
    try {
        const { userId, page = 1, limit = 20 } = params;
        // Validate pagination parameters
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
        const skip = (validPage - 1) * validLimit;
        // Convert userId to ObjectId if it's a string
        const userObjectId = typeof userId === 'string' ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        // Get total count
        const total = await notification_modal_1.default.countDocuments({ userId: userObjectId });
        // Get paginated notifications
        const notifications = await notification_modal_1.default.find({ userId: userObjectId })
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
    }
    catch (error) {
        console.error('Error in getUserNotifications:', error.message);
        return {
            success: false,
            message: error.message || 'Error fetching notifications',
        };
    }
};
exports.getUserNotifications = getUserNotifications;
const getUserUnreadNotifications = async (params) => {
    try {
        const { userId, accountId } = params;
        // Convert userId to ObjectId if it's a string
        const userObjectId = typeof userId === 'string' ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        const query = {
            userId: userObjectId,
            isRead: false,
        };
        if (accountId) {
            query.accountId = accountId;
        }
        else {
            query.accountId = { $exists: false };
        }
        console.log('Unread notifications query:', query);
        // Get unread notifications
        const notifications = await notification_modal_1.default.find(query)
            .sort({ createdAt: -1 })
            .lean();
        return {
            success: true,
            notifications,
            total: notifications.length,
        };
    }
    catch (error) {
        console.error('Error in getUserUnreadNotifications:', error.message);
        return {
            success: false,
            message: error.message || 'Error fetching unread notifications',
        };
    }
};
exports.getUserUnreadNotifications = getUserUnreadNotifications;
const readUserNotifications = async (params) => {
    try {
        const { userId } = params;
        // Convert userId to ObjectId if it's a string
        const userObjectId = typeof userId === 'string' ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        // Mark all notifications as read instead of deleting them
        await notification_modal_1.default.updateMany({ userId: userObjectId }, { $set: { isRead: true } });
        return { success: true };
    }
    catch (error) {
        console.error('Error in readUserNotifications:', error.message);
        return {
            success: false,
            message: error.message || 'Error marking notifications as read',
        };
    }
};
exports.readUserNotifications = readUserNotifications;
const deleteUserNotifications = async (params) => {
    try {
        const { userId } = params;
        // Convert userId to ObjectId if it's a string
        const userObjectId = typeof userId === 'string' ? new mongoose_1.default.Types.ObjectId(userId) : userId;
        // Delete all notifications
        await notification_modal_1.default.deleteMany({ userId: userObjectId });
        return { success: true };
    }
    catch (error) {
        console.error('Error in deleteUserNotifications:', error.message);
        return {
            success: false,
            message: error.message || 'Error deleting notifications',
        };
    }
};
exports.deleteUserNotifications = deleteUserNotifications;

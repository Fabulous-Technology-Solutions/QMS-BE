"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChats = exports.getMessageReactions = exports.markMessageAsRead = exports.removeReaction = exports.addReaction = exports.editMessage = exports.updateReadAt = exports.fetchChatMessages = exports.updateDeliveredAt = exports.getAllChats = exports.deleteChatById = exports.getChatById = exports.getChatsByObj = exports.createChat = void 0;
const message_modal_1 = __importDefault(require("../message/message.modal"));
const chat_modal_1 = __importDefault(require("./chat.modal"));
const reaction_1 = require("../reaction");
const chat_queries_1 = require("./chat.queries");
const mongoose_1 = __importDefault(require("mongoose"));
const createChat = async (data) => {
    const chat = new chat_modal_1.default(data);
    await chat.save();
    return chat;
};
exports.createChat = createChat;
const getChatsByObj = async (objId) => {
    return chat_modal_1.default.find({ obj: objId }).populate('obj').exec();
};
exports.getChatsByObj = getChatsByObj;
const getChatById = async (chatId) => {
    return chat_modal_1.default.findById(chatId).populate('obj').exec();
};
exports.getChatById = getChatById;
const deleteChatById = async (chatId) => {
    return chat_modal_1.default.findByIdAndDelete(chatId).exec();
};
exports.deleteChatById = deleteChatById;
const getAllChats = async () => {
    return chat_modal_1.default.find().populate('obj').exec();
};
exports.getAllChats = getAllChats;
const updateDeliveredAt = async (params) => {
    try {
        const { chatIds, userId } = params;
        // Update existing entries
        await message_modal_1.default.updateMany({
            chat: { $in: chatIds },
            sender: { $ne: userId },
            userSettings: {
                $elemMatch: {
                    userId: userId,
                    $or: [{ deliveredAt: { $exists: false } }, { deliveredAt: null }],
                },
            },
        }, {
            $set: { 'userSettings.$.deliveredAt': new Date() },
        });
        // Add new entries if none exist
        await message_modal_1.default.updateMany({
            chat: { $in: chatIds },
            sender: { $ne: userId },
            'userSettings.userId': { $ne: userId },
        }, {
            $push: {
                userSettings: {
                    userId: userId,
                    deliveredAt: new Date(),
                },
            },
        });
    }
    catch (error) {
        console.log(`Got error in [updateDeliveredAt] for userId ${params?.userId} that is ${JSON.stringify(error)}`);
    }
};
exports.updateDeliveredAt = updateDeliveredAt;
const fetchChatMessages = async (params) => {
    try {
        const { chatId, userId, page = 1, limit = 20 } = params;
        const skipDocuments = (page - 1) * limit;
        const documentsLimit = limit;
        const messagesQuery = {
            chat: chatId,
            $or: [
                {
                    userSettings: {
                        $not: {
                            $elemMatch: {
                                userId,
                                deletedAt: { $exists: true },
                            },
                        },
                    },
                },
                { userSettings: { $elemMatch: { userId, deletedAt: null } } },
            ],
        };
        const totalRecords = await message_modal_1.default.countDocuments(messagesQuery);
        let messages = await message_modal_1.default.find(messagesQuery)
            .populate('sender', '_id name profilePicture')
            .populate('reply')
            .sort({ createdAt: -1 })
            .skip(skipDocuments)
            .limit(documentsLimit);
        let messagesnew = messages?.map((message) => {
            const otherUserSettings = message?.userSettings?.find((setting) => setting?.userId?.toString?.() !== userId?.toString?.());
            return {
                chatId: message?.chat,
                messageId: message?._id,
                sender: message?.sender,
                content: message?.content,
                contentType: message?.contentType,
                contentTitle: message?.contentTitle,
                contentDescription: message?.contentDescription ?? '',
                contentDescriptionType: message?.contentDescriptionType ?? 'text',
                reactionCounts: message?.reactionsCount,
                isRead: otherUserSettings?.readAt ? true : false,
                isDelivered: otherUserSettings?.deliveredAt ? true : false,
                editedAt: message?.editedAt,
                createdAt: message?.createdAt,
                reply: message?.reply
                    ? {
                        _id: message?.reply?._id,
                        content: message?.reply?.content,
                        contentTitle: message?.reply?.contentTitle,
                        contentDescription: message?.reply?.contentDescription ?? '',
                        contentType: message?.reply?.contentType ?? 'text',
                        contentDescriptionType: message?.reply?.contentDescriptionType ?? 'text',
                    }
                    : null,
            };
        });
        const messageIds = messagesnew?.map((message) => message?.messageId);
        (0, exports.updateReadAt)({ chatId, userId, messageIds });
        return {
            page: page,
            limit,
            total: totalRecords,
            messages: messagesnew,
        };
    }
    catch (error) {
        console.error('Error fetching chat messages:', error);
        return {
            messages: [],
            pageNo: 1,
            recordsPerPage: 20,
        };
    }
};
exports.fetchChatMessages = fetchChatMessages;
const updateReadAt = async (params) => {
    try {
        const { chatId, userId, messageIds } = params;
        console.log(`updateReadAt called with params ${JSON.stringify(params)}`);
        // Update existing entries
        const updatedMessagesResponse = await message_modal_1.default.updateMany({
            _id: { $in: messageIds },
            chat: chatId,
            userSettings: {
                $elemMatch: {
                    userId: userId,
                    $or: [{ readAt: { $exists: false } }, { readAt: null }],
                },
            },
        }, {
            $set: { 'userSettings.$.readAt': new Date() },
        });
        console.log(`Got updatedMessagesResponse that is ${JSON.stringify(updatedMessagesResponse)}`);
        // Add new entries if none exist
        const newEntryResponse = await message_modal_1.default.updateMany({
            _id: { $in: messageIds },
            chat: { $in: chatId },
            'userSettings.userId': { $ne: userId },
        }, {
            $push: {
                userSettings: {
                    userId: userId,
                    readAt: new Date(),
                    deliveredAt: new Date(),
                },
            },
        });
        console.log(`Got response of updatedMessagesResponse that is ${JSON.stringify(newEntryResponse)}`);
        return {
            success: true,
        };
    }
    catch (error) {
        console.log(`caught error in updateReadAt that is ${error}`);
        return {
            success: false,
        };
    }
};
exports.updateReadAt = updateReadAt;
const editMessage = async (params) => {
    try {
        console.log(`editMessage util called with params ${JSON.stringify(params)}`);
        const { messageId, userId, content } = params;
        const message = await message_modal_1.default.findById(messageId).populate('reply').populate('sender');
        if (!message) {
            console.log(`Message with ID ${messageId} not found`);
            return {
                success: false,
                message: `Message with ID ${messageId} not found`,
            };
        }
        if (message?.sender?._id?.toString?.() !== userId?.toString?.()) {
            console.log(`User ${userId} is not the sender of message ${messageId}`);
            return {
                success: false,
                message: `User ${userId} is not the sender of message ${messageId}`,
            };
        }
        message.content = content;
        message.editedAt = new Date();
        await message.save();
        console.log(`Message ${messageId} edited successfully and new data is ${JSON.stringify(message)}`);
        return {
            success: true,
            data: message,
        };
    }
    catch (error) {
        console.error(`Error editing message: ${error}`);
        return {
            success: false,
        };
    }
};
exports.editMessage = editMessage;
const addReaction = async (params) => {
    try {
        console.log(`addReaction util called with params ${JSON.stringify(params)}`);
        const { messageId, userId, emoji } = params;
        const userExistingReaction = await reaction_1.Reaction.findOne({ messageId: messageId, userId: userId });
        if (userExistingReaction) {
            userExistingReaction.emoji = emoji;
            return userExistingReaction.save();
        }
        const reactionBody = {
            messageId: messageId,
            userId: userId,
            emoji: emoji,
        };
        const reaction = await reaction_1.Reaction.create(reactionBody);
        console.log(`Got reaction create response in DB [add-reaction]: ${JSON.stringify(reaction)}`);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.addReaction = addReaction;
const removeReaction = async (params) => {
    try {
        console.log(`removeReaction util called with params ${JSON.stringify(params)}`);
        const { messageId, userId } = params;
        const result = await reaction_1.Reaction.deleteOne({ messageId: messageId, userId: userId });
        console.log(`Got response of removeReaction that is ${JSON.stringify(result)}`);
        return {
            success: true,
        };
    }
    catch (error) {
        console.log(`caught error in removeReaction that is ${error}`);
        return {
            success: false,
        };
    }
};
exports.removeReaction = removeReaction;
const markMessageAsRead = async (params) => {
    try {
        console.log(`markMessageAsRead util called with params ${JSON.stringify(params)}`);
        const { chatId, userId } = params;
        // Validate user is part of the chat using aggregation
        const chatDetails = await chat_modal_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(chatId),
                },
            },
            ...chat_queries_1.chatQuery,
        ]).then((result) => result[0]);
        if (!chatDetails) {
            console.log(`Chat with ID ${chatId} not found.`);
            return {
                success: false,
                message: `Chat with ID ${chatId} not found.`,
            };
        }
        // Check if user is a participant
        const isParticipant = chatDetails?.participants?.some((participant) => participant?._id?.toString() === userId?.toString());
        if (!isParticipant) {
            console.log(`User ${userId} is not a participant of chat ${chatId}.`);
            return {
                success: false,
                message: `User is not a part of this chat.`,
            };
        }
        const allChatMessages = await message_modal_1.default.find({ chat: chatId }).distinct('_id');
        const response = await (0, exports.updateReadAt)({ chatId, userId, messageIds: allChatMessages });
        if (!response || !response.success) {
            console.log(`Failed to mark messages as read for chat ${chatId} and user ${userId}`);
            return {
                success: false,
                message: `Failed to mark messages as read for chat ${chatId} and user ${userId}`,
            };
        }
        return {
            success: true,
            chatId,
        };
    }
    catch (error) {
        console.error(`Got error in markMessageAsRead for user ${params?.userId}: ${error.message}`);
        return {
            success: false,
            message: `Internal server error. Please try again.`,
        };
    }
};
exports.markMessageAsRead = markMessageAsRead;
const getMessageReactions = async (params) => {
    try {
        console.log(`getMessageReactions util called with params ${JSON.stringify(params)}`);
        const { messageId, page = 1, limit = 20 } = params;
        // Check if message exists
        const message = await message_modal_1.default.findById(messageId);
        if (!message) {
            console.log(`Message with ID ${messageId} not found`);
            return {
                success: false,
                message: `Message with ID ${messageId} not found`,
                reactions: [],
                page: 1,
                limit: 20,
                total: 0,
            };
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        // Get total count of reactions
        const totalReactions = await reaction_1.Reaction.countDocuments({ messageId });
        // Get reactions for the message with user details and pagination
        const reactions = await reaction_1.Reaction.find({ messageId })
            .populate('userId', '_id name profilePicture email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Format the response
        const formattedReactions = reactions.map((reaction) => ({
            reactionId: reaction._id,
            emoji: reaction.emoji,
            userId: reaction.userId?._id,
            userName: reaction.userId?.name,
            userProfilePicture: reaction.userId?.profilePicture,
            userEmail: reaction.userId?.email,
            createdAt: reaction.createdAt,
        }));
        return {
            success: true,
            messageId,
            page,
            limit,
            total: totalReactions,
            totalPages: Math.ceil(totalReactions / limit),
            reactions: formattedReactions,
        };
    }
    catch (error) {
        console.error(`Got error in getMessageReactions: ${error.message}`);
        return {
            success: false,
            message: `Internal server error. Please try again.`,
            reactions: [],
            page: 1,
            limit: 20,
            total: 0,
        };
    }
};
exports.getMessageReactions = getMessageReactions;
const getUserChats = async (params) => {
    try {
        console.log(`getUserChats util called with params ${JSON.stringify(params)}`);
        const { userId, page = 1, limit = 20, accountId } = params;
        const query = [
            {
                $lookup: {
                    from: 'accounts',
                    let: { memberIds: '$members', managerIds: '$managers' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', new mongoose_1.default.Types.ObjectId(userId)] },
                                        { $eq: ['$accountId', new mongoose_1.default.Types.ObjectId(accountId)] },
                                        {
                                            $or: [{ $in: ['$_id', '$$memberIds'] }, { $in: ['$_id', '$$managerIds'] }],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'userAccounts',
                },
            },
        ];
        // Get all user chats with library details using aggregation
        // Chain: User -> Account -> Library -> Chat
        const userChats = await chat_modal_1.default.aggregate([
            {
                $lookup: {
                    from: 'libraries',
                    let: { objId: '$obj' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$objId'] },
                            },
                        },
                        ...(accountId ? query : []),
                        {
                            $lookup: {
                                from: 'workspaces',
                                localField: 'workspace',
                                foreignField: '_id',
                                as: 'workspace',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: 'subscriptions',
                                            localField: 'moduleId',
                                            foreignField: '_id',
                                            as: 'subscription',
                                            pipeline: [
                                                ...(!accountId
                                                    ? [
                                                        {
                                                            $match: {
                                                                $expr: {
                                                                    $eq: ['$userId', new mongoose_1.default.Types.ObjectId(userId)],
                                                                },
                                                            },
                                                        },
                                                    ]
                                                    : []),
                                            ],
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$subscription',
                                            preserveNullAndEmptyArrays: false,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $unwind: {
                                path: '$workspace',
                                preserveNullAndEmptyArrays: false,
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $gt: [{ $size: { $ifNull: ['$userAccounts', []] } }, 0] },
                                        { $eq: ['$workspace.subscription.userId', new mongoose_1.default.Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                title: 1,
                                description: 1,
                                status: 1,
                                members: 1,
                                managers: 1,
                                workspace: 1,
                            },
                        },
                    ],
                    as: 'library',
                },
            },
            { $unwind: { path: '$library', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'messages',
                    let: { chatId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$chat', '$$chatId'] },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'senderDetails',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            name: 1,
                                            profilePicture: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                sender: { $arrayElemAt: ['$senderDetails', 0] },
                            },
                        },
                        {
                            $project: {
                                content: 1,
                                contentType: 1,
                                createdAt: 1,
                                sender: 1,
                            },
                        },
                    ],
                    as: 'lastMessage',
                },
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
                },
            },
            {
                $project: {
                    _id: 1,
                    chatOf: 1,
                    obj: 1,
                    libraryName: '$library.name',
                    workspaceid: '$library.workspace._id',
                    moduleId: '$library.workspace.moduleId',
                    libraryTitle: '$library.title',
                    libraryDescription: '$library.description',
                    libraryStatus: '$library.status',
                    lastMessage: 1,
                    createdAt: 1,
                },
            },
            { $sort: { 'lastMessage.createdAt': -1, createdAt: -1 } },
        ]);
        // Get unread counts for ALL chats first, then filter
        const chatsWithUnreadCount = await Promise.all(userChats.map(async (chat) => {
            const unreadCount = await message_modal_1.default.countDocuments({
                chat: chat._id,
                sender: { $ne: userId },
                $or: [
                    { userSettings: { $exists: false } },
                    { userSettings: { $size: 0 } },
                    {
                        userSettings: {
                            $not: {
                                $elemMatch: {
                                    userId: new mongoose_1.default.Types.ObjectId(userId),
                                    readAt: { $exists: true, $ne: null },
                                },
                            },
                        },
                    },
                ],
            });
            return {
                chatId: chat._id,
                chatOf: chat.chatOf,
                libraryId: chat.obj,
                libraryName: chat.libraryName || chat.libraryTitle || 'Unknown',
                libraryDescription: chat.libraryDescription,
                libraryStatus: chat.libraryStatus,
                workspaceId: chat.workspaceid,
                moduleId: chat.moduleId,
                unreadCount,
                lastMessage: chat.lastMessage
                    ? {
                        content: chat.lastMessage.content,
                        contentType: chat.lastMessage.contentType,
                        createdAt: chat.lastMessage.createdAt,
                        sender: chat.lastMessage.sender,
                    }
                    : null,
                createdAt: chat.createdAt,
            };
        }));
        // Filter to only include chats with unread messages
        const chatsWithUnreadOnly = chatsWithUnreadCount.filter((chat) => chat.unreadCount > 0);
        // Calculate pagination AFTER filtering
        const totalUnreadChats = chatsWithUnreadOnly.length;
        const skip = (page - 1) * limit;
        const paginatedChats = chatsWithUnreadOnly.slice(skip, skip + limit);
        return {
            success: true,
            page,
            limit,
            total: totalUnreadChats,
            totalPages: Math.ceil(totalUnreadChats / limit),
            chats: paginatedChats,
        };
    }
    catch (error) {
        console.error(`Got error in getUserChats: ${error.message}`);
        return {
            success: false,
            message: `Internal server error. Please try again.`,
            chats: [],
            page: 1,
            limit: 20,
            total: 0,
        };
    }
};
exports.getUserChats = getUserChats;

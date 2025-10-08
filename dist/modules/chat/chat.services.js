"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadAt = exports.fetchChatMessages = exports.updateDeliveredAt = exports.getAllChats = exports.deleteChatById = exports.getChatById = exports.getChatsByObj = exports.createChat = void 0;
const message_modal_1 = __importDefault(require("../message/message.modal"));
const chat_modal_1 = __importDefault(require("./chat.modal"));
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
                    $or: [
                        { deliveredAt: { $exists: false } },
                        { deliveredAt: null },
                    ]
                }
            }
        }, {
            $set: { 'userSettings.$.deliveredAt': new Date() }
        });
        // Add new entries if none exist
        await message_modal_1.default.updateMany({
            chat: { $in: chatIds },
            sender: { $ne: userId },
            'userSettings.userId': { $ne: userId }
        }, {
            $push: {
                userSettings: {
                    userId: userId,
                    deliveredAt: new Date()
                }
            }
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
                                userId, deletedAt: { $exists: true }
                            }
                        }
                    }
                },
                { userSettings: { $elemMatch: { userId, deletedAt: null } } }
            ],
        };
        const totalRecords = await message_modal_1.default.countDocuments(messagesQuery);
        let messages = await message_modal_1.default.find(messagesQuery).populate('sender', '_id name profilePicture').sort({ createdAt: -1 }).skip(skipDocuments).limit(documentsLimit);
        let messagesnew = messages?.map(message => {
            const otherUserSettings = message?.userSettings?.find(setting => setting?.userId?.toString?.() !== userId?.toString?.());
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
                createdAt: message?.createdAt,
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
        console.error("Error fetching chat messages:", error);
        return {
            messages: [],
            pageNo: 1,
            recordsPerPage: 20
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
                    $or: [
                        { readAt: { $exists: false } },
                        { readAt: null }
                    ]
                }
            }
        }, {
            $set: { 'userSettings.$.readAt': new Date() }
        });
        console.log(`Got updatedMessagesResponse that is ${JSON.stringify(updatedMessagesResponse)}`);
        // Add new entries if none exist
        const newEntryResponse = await message_modal_1.default.updateMany({
            _id: { $in: messageIds },
            chat: { $in: chatId },
            'userSettings.userId': { $ne: userId }
        }, {
            $push: {
                userSettings: {
                    userId: userId,
                    readAt: new Date(),
                    deliveredAt: new Date()
                }
            }
        });
        console.log(`Got response of updatedMessagesResponse that is ${JSON.stringify(newEntryResponse)}`);
        return {
            success: true
        };
    }
    catch (error) {
        console.log(`caught error in updateReadAt that is ${error}`);
        return {
            success: false
        };
    }
};
exports.updateReadAt = updateReadAt;

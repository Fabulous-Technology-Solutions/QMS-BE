"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatEvent = void 0;
const chat_modal_1 = __importDefault(require("./chat.modal"));
const mongoose_1 = __importDefault(require("mongoose"));
const message_modal_1 = __importDefault(require("../message/message.modal"));
const chat_services_1 = require("./chat.services");
const chat_queries_1 = require("./chat.queries");
const chatEvent = async (io, socket) => {
    const user = socket?.user;
    const userId = socket?.user?._id.toString();
    console.log('User in chatEvent:', user);
    try {
        const userChats = await chat_modal_1.default.aggregate([
            {
                $lookup: {
                    from: 'libraries',
                    let: { objId: '$obj' },
                    pipeline: [
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
                                    $and: [
                                        { $eq: ['$_id', '$$objId'] },
                                        {
                                            $or: [
                                                { $in: [new mongoose_1.default.Types.ObjectId(userId), '$members'] },
                                                { $in: [new mongoose_1.default.Types.ObjectId(userId), '$managers'] },
                                                { $eq: ['$workspace.subscription.userId', new mongoose_1.default.Types.ObjectId(userId)] },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                members: 1,
                                managers: 1,
                                workspace: 1,
                                subscription: '$workspace.subscription',
                                participants: { $setUnion: ['$members', '$managers', ['$workspace.subscription.userId']] },
                            },
                        },
                    ],
                    as: 'riskLibrary',
                },
            },
            { $unwind: { path: '$riskLibrary', preserveNullAndEmptyArrays: false } },
            {
                $project: {
                    _id: 1,
                    chatOf: 1,
                    obj: 1,
                },
            },
        ]);
        console.log('User Chats:..........', userChats);
        const userChatIds = userChats.map((chat) => chat._id);
        const undeliveredMessagesQuery = {
            chat: { $in: userChatIds },
            $or: [
                { userSettings: { $exists: false } },
                { userSettings: { $size: 0 } },
                {
                    userSettings: {
                        $not: {
                            $elemMatch: {
                                userId: userId,
                            },
                        },
                    },
                },
                {
                    userSettings: {
                        $elemMatch: {
                            userId: { $eq: userId },
                            $or: [{ deliveredAt: { $exists: false } }, { deliveredAt: null }],
                        },
                    },
                },
            ],
        };
        const undeliveredChatIds = await message_modal_1.default.find(undeliveredMessagesQuery).distinct('chat');
        if (undeliveredChatIds?.length) {
            const undeliverdChats = await chat_modal_1.default.aggregate([
                {
                    $match: {
                        _id: { $in: undeliveredChatIds },
                    },
                },
                {
                    $lookup: {
                        from: 'risklibraries',
                        localField: 'obj',
                        foreignField: '_id',
                        as: 'riskLibrary',
                        pipeline: [
                            {
                                $project: {
                                    members: 1,
                                    managers: 1,
                                    participants: { $setUnion: ['$members', '$managers'] },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$riskLibrary',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        otherUserIds: {
                            $filter: {
                                input: '$riskLibrary.participants',
                                cond: { $ne: ['$$this', new mongoose_1.default.Types.ObjectId(userId)] },
                            },
                        },
                    },
                },
            ]);
            undeliverdChats?.forEach((chat) => {
                chat.otherUserIds?.forEach((otherUserId) => {
                    const otherUserSocketId = io.sockets.adapter.rooms.get(otherUserId?.toString?.());
                    if (otherUserSocketId) {
                        io.to(otherUserId?.toString?.()).emit('mark-message-deliver-response', {
                            success: true,
                            chatId: chat?._id,
                            allMsgsDelivered: true,
                        });
                    }
                });
            });
            undeliverdChats?.map(async (chat) => {
                await (0, chat_services_1.updateDeliveredAt)({
                    userId,
                    chatIds: [chat?._id],
                });
            });
        }
    }
    catch (error) {
        console.log('socket connection error');
        socket.emit('socket-error', { message: 'Error in updating chats.' });
        console.log('error', error);
    }
    // send message to specific user
    socket.on('send-message', async (data) => {
        try {
            const senderData = user;
            console.log('Sender Data........:', senderData);
            if (!data?.chatId) {
                socket.emit('socket-error', { message: 'chatId is required.' });
                return;
            }
            let allParticipants = [];
            if (data?.chatId) {
                const validateUserChat = await chat_modal_1.default.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(data?.chatId),
                        },
                    },
                    ...chat_queries_1.chatQuery,
                ]).then((result) => result[0]);
                console.log('validateUserChat', validateUserChat?.participants);
                if (!validateUserChat) {
                    socket.emit('socket-error', { message: 'No chat found against chat id and user.' });
                    return;
                }
                allParticipants =
                    validateUserChat?.participants?.filter((participant) => participant._id.toString?.() !== userId?.toString()) || [];
            }
            let receiversData = Array.isArray(allParticipants) ? allParticipants : [];
            if (!receiversData || receiversData?.length === 0) {
                socket.emit('socket-error', { message: `Invalid receiver data.` });
                return;
            }
            let chatId = data?.chatId;
            const userSettingsBody = [
                {
                    userId,
                    deliveredAt: new Date(),
                    readAt: new Date(),
                },
            ];
            const messageBody = {
                chat: chatId,
                sender: userId,
                contentTitle: data?.contentTitle,
                fileSize: data?.fileSize,
                content: data?.content || '',
                contentDescription: data?.contentDescription,
                contentType: data?.contentType || 'text',
                contentDescriptionType: data?.contentDescriptionType,
                userSettings: userSettingsBody,
            };
            const addMessage = await message_modal_1.default.create(messageBody);
            const messageEmitBody = {
                messageScreenBody: {
                    chatId,
                    messageId: addMessage?._id,
                    sender: {
                        _id: userId,
                        name: senderData?.name,
                        profilePicture: senderData?.profilePicture ?? '',
                    },
                    content: addMessage?.content,
                    contentTitle: addMessage?.contentTitle,
                    contentDescription: addMessage?.contentDescription,
                    contentType: addMessage?.contentType,
                    contentDescriptionType: addMessage?.contentDescriptionType ?? 'text',
                    createdAt: addMessage?.createdAt,
                },
            };
            // const messageDeliveryStatus =
            //   msgDeliveryStatus({ userId, chat: { lastMessage: latestMessageData } }) || {};
            for (const receiver of receiversData) {
                const receiverID = receiver?._id; // Ensure you have the ID from receiver object
                const receiverSocketId = io.sockets.adapter.rooms.get(receiverID?.toString?.());
                if (receiverSocketId) {
                    userSettingsBody?.push({
                        userId: receiverID,
                        deliveredAt: new Date(),
                    });
                }
                const unreadCount = await message_modal_1.default.countDocuments({
                    chat: { $in: chatId },
                    $or: [
                        { userSettings: { $size: 0 } },
                        { 'userSettings.userId': { $ne: receiverID } },
                        {
                            userSettings: {
                                $elemMatch: {
                                    userId: userId,
                                    $or: [{ readAt: null }, { readAt: { $exists: false } }],
                                },
                            },
                        },
                    ],
                });
                if (receiverID.toString() !== userId.toString()) {
                    if (receiverSocketId) {
                        io.to(receiverID.toString()).emit('receive-message', {
                            ...messageEmitBody,
                            unreadCounts: unreadCount,
                        });
                        io.to(userId?.toString?.()).emit('mark-message-deliver-response', {
                            success: true,
                            chatId,
                            allMsgsDelivered: true,
                        });
                    }
                }
            }
            await message_modal_1.default.updateOne({ _id: addMessage._id }, { userSettings: userSettingsBody }, {
                multi: true,
            });
            io.to(userId.toString()).emit('receive-message', {
                ...messageEmitBody,
            });
            // const updateChatBody = {
            //   lastMessage: addMessage?._id,
            //   lastMessageSentAt: new Date(),
            //   'userSettings.$[elem].hasUserDeletedChat': false,
            // };
            // const objectChatId = new mongoose.Types.ObjectId(chatId);
            // const objectUserId = new mongoose.Types.ObjectId(userId);
            // await ChatModel.updateOne(
            //   { _id: objectChatId },
            //   { $set: updateChatBody },
            //   {
            //     arrayFilters: [{ 'elem.userId': objectUserId }],
            //   }
            // );
            // const allChatMessages = await Message.find({ chat: chatId }).distinct('_id');
            // await updateReadAt({
            //   userId,
            //   chatId,
            //   messageIds: allChatMessages
            // });
            // chatDetails?.markModified('userSettings');
        }
        catch (error) {
            console.log(error);
            socket.emit('socket-error', { message: 'Failed to send message' });
            return;
        }
    });
    socket.on('get-library-singlechat', async (data) => {
        try {
            if (!data?.libraryId) {
                socket.emit('socket-error', { message: 'Library ID is required' });
                return;
            }
            let libraryChat = await chat_modal_1.default.findOne({ obj: data.libraryId });
            if (!libraryChat) {
                libraryChat = await chat_modal_1.default.create({ obj: data.libraryId, chatOf: 'Library' });
            }
            socket.emit('library-singlechat-response', { success: true, chat: libraryChat });
        }
        catch (error) {
            console.log(error);
            socket.emit('socket-error', { message: 'Failed to retrieve library chats' });
        }
    });
    socket.on('fetch-user-chat-messages', async (data) => {
        try {
            // console.log(`fetch-user-chat-messages event received for socket ${socketId} and user ${userId} with data: ${JSON.stringify(data)}`);
            const { chatId } = data;
            if (!chatId) {
                socket.emit('socket-error', { message: 'Chat id is required.' });
                return;
            }
            const response = await (0, chat_services_1.fetchChatMessages)({ ...data, userId });
            console.log('fetch-user-chat-messages response:', response);
            socket.emit('user-chat-messages', response);
            const chatDetails = await chat_modal_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(data?.chatId),
                    },
                },
                ...chat_queries_1.chatQuery,
            ]).then((result) => result[0]);
            if (chatDetails) {
                const otherParticipant = chatDetails?.participants?.find((participant) => participant._id.toString() !== userId.toString());
                console.log('Other participant:', otherParticipant);
                const otherParticipantId = otherParticipant?._id?.toString?.();
                const otherParticipantSocketId = io.sockets.adapter.rooms.get(otherParticipantId);
                if (otherParticipantSocketId) {
                    io.to(otherParticipantId).emit('mark-message-read-response', {
                        success: true,
                        chatId,
                        allMsgsRead: true,
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            socket.emit('socket-error', { message: 'Error in fetching unseen chats.' });
        }
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
};
exports.chatEvent = chatEvent;

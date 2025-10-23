import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket/socket.middleware';
import ChatModel from './chat.modal';
import mongoose, { ObjectId } from 'mongoose';
import Message from '../message/message.modal';
import {
  addReaction,
  editMessage,
  fetchChatMessages,
  getMessageReactions,
  getUserChats,
  markMessageAsRead,
  removeReaction,
  updateDeliveredAt,
} from './chat.services';
import { chatQuery } from './chat.queries';
import { Reaction } from '../reaction';
import {
  getUserNotifications,
  getUserUnreadNotifications,
  readUserNotifications,
  createNotification,
} from '../notification/notification.services';
import AccountModel from './../account/account.modal';

export const chatEvent = async (io: Server, socket: AuthenticatedSocket) => {
  const user = socket?.user;
  const userId = socket?.user?._id.toString();
  console.log('User in chatEvent:', user);

  try {
    const userChats = await ChatModel.aggregate([
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
                        { $in: [new mongoose.Types.ObjectId(userId), '$members'] },
                        { $in: [new mongoose.Types.ObjectId(userId), '$managers'] },
                        { $eq: ['$workspace.subscription.userId', new mongoose.Types.ObjectId(userId)] },
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
    const undeliveredChatIds = await Message.find(undeliveredMessagesQuery).distinct('chat');

    if (undeliveredChatIds?.length) {
      const undeliverdChats = await ChatModel.aggregate([
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
                cond: { $ne: ['$$this', new mongoose.Types.ObjectId(userId)] },
              },
            },
          },
        },
      ]);

      undeliverdChats?.forEach((chat) => {
        chat.otherUserIds?.forEach((otherUserId: ObjectId) => {
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
        await updateDeliveredAt({
          userId,
          chatIds: [chat?._id],
        });
      });
    }
  } catch (error) {
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

      console.log('mention users in chat :', data?.mentionUsers);
      let validateUserChat;
      if (data?.chatId) {
        validateUserChat = await ChatModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(data?.chatId),
            },
          },
          ...chatQuery,
        ]).then((result) => result[0]);

        console.log('validateUserChat', validateUserChat?.participants);

        if (!validateUserChat) {
          socket.emit('socket-error', { message: 'No chat found against chat id and user.' });
          return;
        }

        allParticipants =
          validateUserChat?.participants?.filter(
            (participant: { _id: mongoose.Types.ObjectId }) => participant._id.toString?.() !== userId?.toString()
          ) || [];
      }
      let receiversData = Array.isArray(allParticipants) ? allParticipants : [];

      if (!receiversData || receiversData?.length === 0) {
        socket.emit('socket-error', { message: `Invalid receiver data.` });
        return;
      }

      let chatId = data?.chatId;

      const userSettingsBody: { userId: string; deliveredAt: Date; readAt?: Date }[] = [
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
        reply: data?.reply || null,
      };
      let replymessage;
      if (data?.reply) {
        replymessage = await Message.findOne({ _id: data?.reply }).populate('sender', '_id name profilePicture');
      }

      const addMessage = await Message.create(messageBody);

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
          reply: replymessage && {
            _id: replymessage?._id,
            content: replymessage?.content,
            contentTitle: replymessage?.contentTitle,
            contentDescription: replymessage?.contentDescription,
            contentType: replymessage?.contentType,
            contentDescriptionType: replymessage?.contentDescriptionType ?? 'text',
          },
        },
      };

      // const messageDeliveryStatus =
      //   msgDeliveryStatus({ userId, chat: { lastMessage: latestMessageData } }) || {};
      for (const receiver of receiversData) {
        const receiverID = receiver?._id; // Ensure you have the ID from receiver object
        const receiverSocketId = io.sockets.adapter.rooms.get(receiverID?.toString?.());

        if (receiverSocketId) {
          userSettingsBody?.push({
            userId: receiverID?.toString?.(),
            deliveredAt: new Date(),
          });
        }

        const unreadCount = await Message.countDocuments({
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

      // Send notifications to mentioned users
      if (data?.mentionUsers && Array.isArray(data?.mentionUsers) && data?.mentionUsers.length > 0) {
        const Accounts = await AccountModel.find({ _id: { $in: data?.mentionUsers } })
          .populate('user', '_id name profilePicture')
          .select('_id user accountId');

        console.log('Accounts of mentioned users :', Accounts);

        // Send notification to each mentioned user
        for (const account of Accounts) {
          const mentionedUser = account.user as any;
          const mentionedUserId = mentionedUser?._id;

          // Don't send notification to the sender
          if (mentionedUserId && mentionedUserId?.toString() !== userId?.toString()) {
            try {
              // Get message preview (limit to 50 characters)
              const messagePreview = data?.content
                ? data.content.substring(0, 50) + (data.content.length > 50 ? '...' : '')
                : 'mentioned you in a message';

              const notificationParams: any = {
                userId: mentionedUserId,
                title: 'You were mentioned',
                message: `${senderData?.name || 'Someone'} mentioned you: ${messagePreview}`,
                type: 'message',
                notificationFor: validateUserChat?.chatOf,
                forId: validateUserChat?.obj,
                sendEmailNotification: true, // Send email for mentions
                subId: data?.subId==='default'? account.accountId || userId : data?.subId,
                accountId: account._id,
                link: `/capa/${data.moduleId}/workspace/${data.workspaceId}/library/detail/${data.libraryId}?fromRecentChats=true`, // Example link to the chat
              };

     
              if (data?.subId) {
                console.log(`Sub ID for notification: ${data.subId}`);
                // notificationParams.subId = data.subId;
              }
              console.log(notificationParams);

              await createNotification(notificationParams, data.workspaceId, 'mentationchat');

              console.log(`Notification sent to mentioned user: ${mentionedUserId}`);
            } catch (notifError) {
              console.error(`Failed to send notification to user ${mentionedUserId}:`, notifError);
            }
          }
        }
      }

      await Message.updateOne(
        { _id: addMessage._id },
        { userSettings: userSettingsBody },
        {
          multi: true,
        }
      );

      io.to(userId.toString()).emit('receive-message', {
        ...messageEmitBody,
      });
    } catch (error) {
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

      let libraryChat = await ChatModel.findOne({ obj: data.libraryId });
      if (!libraryChat) {
        libraryChat = await ChatModel.create({ obj: data.libraryId, chatOf: 'Library' });
      }
      socket.emit('library-singlechat-response', { success: true, chat: libraryChat });
    } catch (error) {
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
      const response = await fetchChatMessages({ ...data, userId });
      console.log('fetch-user-chat-messages response:', response);
      socket.emit('user-chat-messages', response);
      const chatDetails = await ChatModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(data?.chatId),
          },
        },
        ...chatQuery,
      ]).then((result) => result[0]);
      if (chatDetails) {
        const otherParticipant = chatDetails?.participants?.find(
          (participant: { _id: string }) => participant._id.toString() !== userId.toString()
        );
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
    } catch (error) {
      console.log(error);
      socket.emit('socket-error', { message: 'Error in fetching unseen chats.' });
    }
  });

  socket.on('edit-message', async (data) => {
    try {
      const response = await editMessage({ ...data, userId });
      if (!response?.success) {
        socket.emit('socket-error', { message: response?.message });
        return;
      }
      let allParticipants = [];

      if (response?.data?.chat) {
        const validateUserChat = await ChatModel.aggregate([
          {
            $match: {
              _id: response?.data?.chat,
            },
          },
          ...chatQuery,
        ]).then((result) => result[0]);

        console.log('validateUserChat', validateUserChat?.participants);

        if (!validateUserChat) {
          socket.emit('socket-error', { message: 'No chat found against chat id and user.' });
          return;
        }

        allParticipants =
          validateUserChat?.participants?.filter(
            (participant: { _id: string }) => participant._id.toString?.() !== userId?.toString()
          ) || [];
      }
      let receiversData = Array.isArray(allParticipants) ? allParticipants : [];

      if (!receiversData || receiversData?.length === 0) {
        socket.emit('socket-error', { message: `Invalid receiver data.` });
        return;
      }

      let chatId = response?.data?.chat;

      const messageEmitBody = {
        messageScreenBody: {
          chatId,
          messageId: response?.data?._id,
          sender: {
            _id: userId,
            name: user?.name,
            profilePicture: user?.profilePicture ?? '',
          },
          content: response?.data?.content,
          contentTitle: response?.data?.contentTitle,
          contentDescription: response?.data?.contentDescription,
          contentType: response?.data?.contentType,
          contentDescriptionType: response?.data?.contentDescriptionType ?? 'text',
          createdAt: response?.data?.createdAt,
          editedAt: response?.data?.editedAt,
          reply: response?.data?.reply && {
            _id: response?.data?.reply?._id,
            content: response?.data?.reply?.content,
            contentTitle: response?.data?.reply?.contentTitle,
            contentDescription: response?.data?.reply?.contentDescription,
            contentType: response?.data?.reply?.contentType,
            contentDescriptionType: response?.data?.reply?.contentDescriptionType ?? 'text',
          },
        },
      };

      for (const receiver of receiversData) {
        const receiverID = receiver?._id; // Ensure you have the ID from receiver object
        const receiverSocketId = io.sockets.adapter.rooms.get(receiverID?.toString?.());

        const unreadCount = await Message.countDocuments({
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
            io.to(receiverID.toString()).emit('receive-edit-message', {
              ...messageEmitBody,
              unreadCounts: unreadCount,
            });
          }
        }
      }

      io.to(userId.toString()).emit('receive-edit-message', {
        ...messageEmitBody,
      });
    } catch (error) {
      console.log(error);
      socket.emit('socket-error', { message: 'Failed to edit message' });
    }
  });

  socket.on('add-reaction', async (data) => {
    try {
      const { emoji, messageId } = data;
      if (!emoji || !messageId) {
        socket.emit('socket-error', { message: 'Emoji and message id are required.' });
        return;
      }

      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit('socket-error', { message: 'Message not found.' });
        return;
      }

      // Validate user is part of the chat
      const chatDetails = await ChatModel.aggregate([
        {
          $match: {
            _id: message.chat,
          },
        },
        ...chatQuery,
      ]).then((result) => result[0]);

      if (!chatDetails) {
        socket.emit('socket-error', { message: 'Chat not found.' });
        return;
      }

      const isParticipant = chatDetails?.participants?.some(
        (participant: { _id: string }) => participant?._id?.toString() === userId?.toString()
      );

      if (!isParticipant) {
        socket.emit('socket-error', { message: 'User is not a part of chat.' });
        return;
      }

      const userExistingReaction = await Reaction.findOne({
        messageId: messageId,
        userId: userId,
      });

      // Initialize reactionsCount if it doesn't exist
      if (!message.reactionsCount) {
        message.reactionsCount = new Map();
      }

      if (userExistingReaction) {
        const existingEmoji = userExistingReaction.emoji;

        if (existingEmoji && message.reactionsCount.get(existingEmoji) && message.reactionsCount.get(existingEmoji)! > 0) {
          const newCount = message.reactionsCount.get(existingEmoji)! - 1;
          if (newCount > 0) {
            message.reactionsCount.set(existingEmoji, newCount);
          } else {
            message.reactionsCount.delete(existingEmoji);
          }
        }

        userExistingReaction.emoji = emoji;
        await userExistingReaction.save();
      } else {
        const reactionBody = {
          messageId: messageId,
          userId: userId,
          emoji,
        };
        await Reaction.create(reactionBody);
      }

      message.reactionsCount.set(emoji, (message.reactionsCount.get(emoji) || 0) + 1);

      message.markModified('reactionsCount');
      await message.save();

      const reactionsList = await Reaction.find({ messageId: messageId }).populate('userId', '_id name profilePicture');

      const detailedReactions = reactionsList.map((reaction: any) => ({
        userId: reaction.userId?._id,
        userName: reaction.userId?.name,
        profilePicture: reaction.userId?.profilePicture,
        emoji: reaction.emoji,
      }));

      const payload = {
        chatId: message.chat,
        messageId,
        emoji,
        reactionsCount: Object.fromEntries(message.reactionsCount),
        userId,
        reactions: detailedReactions,
      };

      io.to(userId.toString()).emit('reaction', payload);

      // Emit to other participants
      const otherParticipants =
        chatDetails?.participants?.filter(
          (participant: { _id: string }) => participant?._id?.toString() !== userId?.toString()
        ) || [];

      for (const participant of otherParticipants) {
        const participantId = participant?._id?.toString();
        if (participantId) {
          io.to(participantId).emit('reaction', payload);
        }
      }

      await addReaction({ ...data, userId });
    } catch (error) {
      console.log(`Got error in add-reaction:`, error);
      socket.emit('socket-error', { message: 'Error in adding reaction.' });
    }
  });

  socket.on('remove-reaction', async (data) => {
    try {
      const { emoji, messageId } = data;

      if (!emoji || !messageId) {
        socket.emit('socket-error', { message: 'Emoji and message id are required.' });
        return;
      }

      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit('socket-error', { message: 'Message not found.' });
        return;
      }

      // Validate user is part of the chat
      const chatDetails = await ChatModel.aggregate([
        {
          $match: {
            _id: message.chat,
          },
        },
        ...chatQuery,
      ]).then((result) => result[0]);

      if (!chatDetails) {
        socket.emit('socket-error', { message: 'Chat not found.' });
        return;
      }

      const isParticipant = chatDetails?.participants?.some(
        (participant: { _id: string }) => participant?._id?.toString() === userId?.toString()
      );

      if (!isParticipant) {
        socket.emit('socket-error', { message: 'User is not a part of chat.' });
        return;
      }

      const userReaction = await Reaction.findOne({
        messageId: messageId,
        userId: userId,
        emoji,
      });

      if (!userReaction) {
        socket.emit('socket-error', {
          message: 'No reaction from the user found for the message or emoji.',
        });
        return;
      }

      // Initialize reactionsCount if it doesn't exist
      if (!message.reactionsCount) {
        message.reactionsCount = new Map();
      }

      // Remove the user's reaction
      await userReaction.deleteOne();

      // Update the reactions count
      if (message.reactionsCount.has(emoji)) {
        const currentCount = message.reactionsCount.get(emoji)!;
        const newCount = currentCount - 1;
        if (newCount > 0) {
          message.reactionsCount.set(emoji, newCount);
        } else {
          message.reactionsCount.delete(emoji);
        }
      }

      message.markModified('reactionsCount');
      await message.save();

      // Get updated reactions list
      const reactionsList = await Reaction.find({ messageId: messageId }).populate('userId', '_id name profilePicture');

      const detailedReactions = reactionsList.map((reaction: any) => ({
        userId: reaction.userId?._id,
        userName: reaction.userId?.name,
        profilePicture: reaction.userId?.profilePicture,
        emoji: reaction.emoji,
      }));

      const payload = {
        chatId: message.chat,
        messageId,
        emoji,
        reactionsCount: Object.fromEntries(message.reactionsCount),
        userId,
        reactions: detailedReactions,
      };

      io.to(userId.toString()).emit('remove-reaction-response', payload);

      // Emit to other participants
      const otherParticipants =
        chatDetails?.participants?.filter(
          (participant: { _id: string }) => participant?._id?.toString() !== userId?.toString()
        ) || [];

      for (const participant of otherParticipants) {
        const participantId = participant?._id?.toString();
        if (participantId) {
          io.to(participantId).emit('remove-reaction-response', payload);
        }
      }

      await removeReaction({ ...data, userId });
    } catch (error) {
      console.log(`Got error in remove-reaction:`, error);
      socket.emit('socket-error', { message: 'Error in removing reaction.' });
    }
  });

  socket.on('mark-message-as-read', async (data) => {
    try {
      const markAsReadResponse = await markMessageAsRead({ ...data, userId });
      if (!markAsReadResponse?.success) {
        socket.emit('socket-error', { message: markAsReadResponse?.message });
        return;
      }
      socket.emit('mark-message-read-response', { success: true });
      const { chatId } = markAsReadResponse;

      // Get chat details with participants using aggregation
      const chatDetails = await ChatModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(chatId),
          },
        },
        ...chatQuery,
      ]).then((result) => result[0]);

      if (!chatDetails) {
        console.log('Chat not found');
        return;
      }

      const otherParticipants =
        chatDetails?.participants?.filter(
          (participant: { _id: string }) => participant?._id?.toString() !== userId?.toString()
        ) || [];

      otherParticipants.forEach((otherParticipant: { _id: string }) => {
        const participantId = otherParticipant?._id?.toString();
        if (participantId) {
          const isUserOnline = io.sockets.adapter.rooms.get(participantId) ? true : false;
          if (isUserOnline) {
            io.to(participantId).emit('mark-message-read-response', {
              success: true,
              chatId,
              userId,
              allMsgsRead: true,
            });
          }
        }
      });
    } catch (error: any) {
      console.log(`Got error in mark-message-as-read: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in marking message as read.' });
    }
  });

  socket.on('get-message-reactions', async (data) => {
    try {
      const { messageId, page = 1, limit = 20 } = data;

      if (!messageId) {
        socket.emit('socket-error', { message: 'Message ID is required.' });
        return;
      }

      // Validate pagination parameters
      const validPage = Math.max(1, parseInt(page) || 1);
      const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

      const reactionsResponse = await getMessageReactions({
        messageId,
        page: validPage,
        limit: validLimit,
      });

      if (!reactionsResponse?.success) {
        socket.emit('socket-error', { message: reactionsResponse?.message });
        return;
      }

      socket.emit('message-reactions-response', {
        success: true,
        messageId: reactionsResponse.messageId,
        page: reactionsResponse.page,
        limit: reactionsResponse.limit,
        total: reactionsResponse.total,
        totalPages: reactionsResponse.totalPages,
        reactions: reactionsResponse.reactions,
      });
    } catch (error: any) {
      console.log(`Got error in get-message-reactions: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in getting message reactions.' });
    }
  });

  socket.on('get-user-chats', async (data) => {
    try {
      const { page = 1, limit = 20 } = data;

      // Validate pagination parameters
      const validPage = Math.max(1, parseInt(page) || 1);
      const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

      const chatsResponse = await getUserChats({
        userId,
        page: validPage,
        limit: validLimit,
        accountId:data?.subId,
      });

      if (!chatsResponse?.success) {
        socket.emit('socket-error', { message: chatsResponse?.message });
        return;
      }

      socket.emit('user-chats-response', {
        success: true,
        page: chatsResponse.page,
        limit: chatsResponse.limit,
        total: chatsResponse.total,
        totalPages: chatsResponse.totalPages,
        chats: chatsResponse.chats,
      });
    } catch (error: any) {
      console.log(`Got error in get-user-chats: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in getting user chats.' });
    }
  });

  ////////////////////// Get User Notifications /////////////////////////
  socket.on('get-user-notifications', async (data) => {
    try {
      const { page = 1, limit = 20 } = data;

      // Validate pagination parameters
      const validPage = Math.max(1, parseInt(page) || 1);
      const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

      const notificationsResponse = await getUserNotifications({
        userId,
        page: validPage,
        limit: validLimit,
      });

      if (!notificationsResponse?.success) {
        socket.emit('socket-error', { message: notificationsResponse?.message });
        return;
      }

      socket.emit('user-notifications', {
        success: true,
        page: notificationsResponse.page,
        limit: notificationsResponse.limit,
        total: notificationsResponse.total,
        totalPages: notificationsResponse.totalPages,
        notifications: notificationsResponse.notifications,
      });
    } catch (error: any) {
      console.log(`Got error in get-user-notifications: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in fetching notifications.' });
    }
  });

  ////////////////////// Get User Unread Notifications /////////////////////////
  socket.on('get-user-unread-notifications', async (data) => {
    try {
      console.log('get-user-unread-notifications data:', data, userId);
      const notificationsResponse = await getUserUnreadNotifications({ userId, subId: data?.subId });

      if (!notificationsResponse?.success) {
        socket.emit('socket-error', { message: notificationsResponse?.message });
        return;
      }

      socket.emit('user-unread-notifications', {
        success: true,
        total: notificationsResponse.total,
        notifications: notificationsResponse.notifications,
      });
    } catch (error: any) {
      console.log(`Got error in get-user-unread-notifications: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in fetching unread notifications.' });
    }
  });

  ////////////////////// Read User Notifications /////////////////////////
  socket.on('read-user-notifications', async (data) => {
    try {
      const { accountId } = data;
      console.log('read-user-notifications data:', data, userId);
      const result = await readUserNotifications({ userId, accountId });

      if (!result?.success) {
        socket.emit('socket-error', { message: result?.message });
        return;
      }

      socket.emit('notifications-read-response', {
        success: true,
        message: 'All notifications marked as read.',
      });
    } catch (error: any) {
      console.log(`Got error in read-user-notifications: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in marking notifications as read.' });
    }
  });

  ////////////////////// Send Notification /////////////////////////
  socket.on('send-notification', async (data) => {
    try {
      const { userId: targetUserId, title, message, type, accountId, sendEmail } = data;

      // Validate required fields
      if (!targetUserId || !title || !message || !type) {
        socket.emit('socket-error', {
          message: 'Missing required fields: userId, title, message, and type are required.',
        });
        return;
      }

      // Validate notification type
      const validTypes = ['serviceListing', 'booking', 'user', 'review', 'message', 'payout'];
      if (!validTypes.includes(type)) {
        socket.emit('socket-error', {
          message: `Invalid notification type. Must be one of: ${validTypes.join(', ')}`,
        });
        return;
      }

      const result = await createNotification(
        {
          userId: targetUserId,
          title,
          message,
          type,
          accountId,
          sendEmailNotification: sendEmail || false,
        },
        data.workspaceId,
        'custom'
      );

      if (!result?.success) {
        socket.emit('socket-error', { message: result?.message });
        return;
      }

      socket.emit('notification-sent-response', {
        success: true,
        notification: result.notification,
        message: result.message,
      });
    } catch (error: any) {
      console.log(`Got error in send-notification: ${JSON.stringify(error?.stack)}`);
      socket.emit('socket-error', { message: 'Error in sending notification.' });
    }
  });
};

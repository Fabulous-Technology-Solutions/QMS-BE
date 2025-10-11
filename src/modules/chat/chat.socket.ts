import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket/socket.middleware';
import ChatModel from './chat.modal';
import mongoose, { ObjectId } from 'mongoose';
import Message from '../message/message.modal';
import { editMessage, fetchChatMessages, updateDeliveredAt } from './chat.services';
import { chatQuery } from './chat.queries';

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

      if (data?.chatId) {
        const validateUserChat = await ChatModel.aggregate([
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
            (participant: any) => participant._id.toString?.() !== userId?.toString()
          ) || [];
      }
      let receiversData = Array.isArray(allParticipants) ? allParticipants : [];

      if (!receiversData || receiversData?.length === 0) {
        socket.emit('socket-error', { message: `Invalid receiver data.` });
        return;
      }

      let chatId = data?.chatId;

      const userSettingsBody: any[] = [
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
            userId: receiverID,
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
          (participant: any) => participant._id.toString() !== userId.toString()
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
            (participant: any) => participant._id.toString?.() !== userId?.toString()
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

  socket.on('chat message', (msg: any) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
};

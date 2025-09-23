import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket/socket.middleware';
import ChatModel from './chat.modal';
import mongoose, { ObjectId } from 'mongoose';
import Message from '../message/message.modal';
import { updateDeliveredAt } from './chat.services';
import { User } from '../user';

export const chatEvent = async (io: Server, socket: AuthenticatedSocket) => {
  const user = socket?.user;
  const userId = socket?.user?._id.toString();
  console.log('User in chatEvent:', user);

  try {
    const userChats = await ChatModel.aggregate([
      {
      $lookup: {
        from: 'risklibraries',
        let: { objId: '$obj' },
        pipeline: [
        {
          $lookup:{
            from: 'workspaces',
            localField: 'workspace',
            foreignField: '_id',
            as: 'workspace',
            pipeline: [
              {
                $lookup:{
                  from:'subscriptions',
                  localField:'moduleId',
                  foreignField:'_id',
                  as:'subscription'
                }
              },
              {
                $unwind:{
                  path: '$subscription',
                  preserveNullAndEmptyArrays: false
                }
              }
            ],
          }
        },
        {
          $unwind:{
            path: '$workspace',
            preserveNullAndEmptyArrays: false
          }
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
        obj: 1
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
        let receiverId = data?.receiverId;
        const senderData = user; ////////////////////// this is required for process /////////////////////////
        if (!data?.chatType) {
          socket.emit('socket-error', { message: 'chatType is required.' });
          return;
        }
        if (!receiverId && !data?.chatId && data?.chatType !== 'contact') {
          socket.emit('socket-error', { message: 'Receiver id or chat id is required.' });
          return;
        }

        let allParticipants = [];

        if (data?.chatId) {
          const validateUserChat = await ChatModel.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(data?.chatId),
              }
            },
            {
              $lookup: {
                from: 'risklibraries',
                let: { objId: '$obj' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$_id', '$$objId'] }
                    }
                  },
                  {
                    $project: {
                      members: 1,
                      managers: 1,
                      participants: { $setUnion: ['$members', '$managers'] }
                    }
                  }
                ],
                as: 'riskLibrary'
              }
            },
            {
              $unwind: {
                path: '$riskLibrary',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 1,
                participants: '$riskLibrary.participants',
                chatType: 1,
                isGroup: 1
              }
            }
          ]).then(result => result[0]);




          if (!validateUserChat) {
            socket.emit('socket-error', { message: 'No chat found against chat id and user.' });
            return;
          }
          if (receiverId && !validateUserChat?.participants?.includes(receiverId)) {
            socket.emit('socket-error', {
              message: `You can't send message to user who is not part of chat.`
            });
            return;
          } else {
            allParticipants = validateUserChat?.participants?.filter(
              (participant: any) => participant.toString?.() !== userId?.toString()
            );
          }
        }
        let receiversData;

        if (data?.chatType === 'contact' && allParticipants.length === 0) {
          receiversData = await User.find({ adminRole: 'admin' });
          receiverId = receiversData[0]?._id;

          allParticipants.push(receiverId);
        } else {
          receiversData = await User.find({ _id: { $in: allParticipants } });
        }

        if (receiversData?.length === 0) {
          socket.emit('socket-error', { message: `Invalid receiver data.` });
          return;
        }

        let chatId = data?.chatId;

        if (!chatId) {
          let chat;

          chat = await ChatModel.findOne({
            chatType: data?.chatType,
            isGroup: false,
            participants: { $all: [userId, receiverId], $size: 2 }
          });

          if (!chat) {
            chat = await ChatModel.create({
              participants: [userId, receiverId],
              chatType: data?.chatType,
              isGroup: false
            });

          }

          chatId = chat._id;
        }

        const chatDetailsQuery = {
          ...(chatId ? { _id: chatId } : { participants: { $all: [userId, receiverId] } })
        };
        const chatDetails = await ChatModel.findOne(chatDetailsQuery).populate('participants');
        if (!chatDetails) {
          socket.emit('socket-error', {
            message: 'No chat found against chat id and participants.'
          });
          return;
        }

        const userSettingsBody = [
          {
            userId,
            deliveredAt: new Date(),
            readAt: new Date()
          }
        ];

        const messageBody = {
          chat: chatId,
          sender: userId,
          contentTitle: data?.contentTitle,
          fileSize: data?.fileSize,
          content: data?.content,
          contentDescription: data?.contentDescription,
          contentType: data?.contentType,
          contentDescriptionType: data?.contentDescriptionType,
          userSettings: userSettingsBody,
          alert_result: data?.alert_result
        };
        const addMessage = await Message.create(messageBody);

      

        const messageEmitBody = {

          messageScreenBody: {
            chatId,
            messageId: addMessage?._id,
            sender: {
              _id: userId,
              name: senderData?.name,
              profilePicture: senderData?.profilePicture ?? ''
            },
            content: addMessage?.content,
    
            contentTitle: addMessage?.contentTitle,
        
            contentDescription: addMessage?.contentDescription,
            contentType: addMessage?.contentType,
            contentDescriptionType: addMessage?.contentDescriptionType ?? 'text',
          
          }
        };

        const messageDeliveryStatus =
          // msgDeliveryStatus({ userId, chat: { lastMessage: latestMessageData } }) || {};
        // for (const receiver of receiversData) {
        //   const receiverID = receiver?._id; // Ensure you have the ID from receiver object
        //   const receiverSocketId = io.sockets.adapter.rooms.get(receiverID?.toString?.());

        //   // if (receiverSocketId) {
        //   //   userSettingsBody.push({
        //   //     userId: receiverID,
        //   //     deliveredAt: new Date()
        //   //   });
        //   // }

        //   const unreadCount = await Message.countDocuments({
        //     chat: { $in: chatId },
        //     $or: [
        //       { userSettings: { $size: 0 } },
        //       { 'userSettings.userId': { $ne: receiverID } },
        //       {
        //         userSettings: {
        //           $elemMatch: {
        //             userId: userId,
        //             $or: [{ readAt: null }, { readAt: { $exists: false } }]
        //           }
        //         }
        //       }
        //     ]
        //   });

        //   if (receiverID.toString() !== userId.toString()) {
        //     if (receiverSocketId) {
        //       io.to(receiverID.toString()).emit('receive-message', {
        //         ...messageEmitBody,
        //         unreadCounts: unreadCount,
        //         chatScreenBody: {
        //           // ...messageEmitBody.chatScreenBody,
        //           // chatName: chatNameForUser(chatDetails, receiverID),
        //           // displayPicture: chatProfileForUser(chatDetails, receiverID)
        //         }
        //       });
        //       io.to(userId?.toString?.()).emit('mark-message-deliver-response', {
        //         success: true,
        //         chatId,
        //         allMsgsDelivered: true
        //       });
        //     } 
        //   }
        // }

        await Message.updateOne(
          { _id: addMessage._id },
          { userSettings: userSettingsBody },
          {
            multi: true
          }
        );

        io.to(userId.toString()).emit('receive-message', {
          ...messageEmitBody,
          chatScreenBody: {
            // ...messageEmitBody.chatScreenBody,
            unreadCount: 0,
            // chatName: chatNameForUser(chatDetails, userId), // Set chatName for the sender
            // displayPicture: chatProfileForUser(chatDetails, userId), // Set displayPicture for the sender,
            ...(Object.keys(messageDeliveryStatus || {})?.length && {
              ...messageDeliveryStatus
            })
          }
        });

        const updateChatBody = {
          lastMessage: addMessage?._id,
          lastMessageSentAt: new Date(),
          'userSettings.$[elem].hasUserDeletedChat': false
        };

        const objectChatId = new mongoose.Types.ObjectId(chatId);
        const objectUserId = new mongoose.Types.ObjectId(userId);
        await ChatModel.updateOne(
          { _id: objectChatId },
          { $set: updateChatBody },
          {
            arrayFilters: [{ 'elem.userId': objectUserId }]
          }  
        );

        // const allChatMessages = await Message.find({ chat: chatId }).distinct('_id');
        // await updateReadAt({
        //   userId,
        //   chatId,
        //   messageIds: allChatMessages
        // });

        chatDetails.markModified('userSettings');
      } catch (error) {
        console.log(error);

        socket.emit('socket-error', { message: 'Failed to send message' });
        return;
      }
    });


 




  socket.on('chat message', (msg: any) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
};

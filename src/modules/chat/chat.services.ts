import Messages from "../message/message.modal";
import {DeliveredMessage, ICreateChat, IGetMessages, IMessageIds} from "./chat.interfaces";
import ChatModel from "./chat.modal";
import { IgetMessageResponse } from './../message/message.interfaces';

export const createChat = async (data: ICreateChat) => {
  const chat = new ChatModel(data);
  await chat.save();
  return chat;
};
export const getChatsByObj = async (objId: string) => {
  return ChatModel.find({ obj: objId }).populate('obj').exec();
};

export const getChatById = async (chatId: string) => {
  return ChatModel.findById(chatId).populate('obj').exec();
};
export const deleteChatById = async (chatId: string) => {
  return ChatModel.findByIdAndDelete(chatId).exec();
};
export const getAllChats = async () => {    
  return ChatModel.find().populate('obj').exec();
};

export const updateDeliveredAt = async (params: DeliveredMessage) => {
        try {
            const { chatIds, userId } = params;
            // Update existing entries
            await Messages.updateMany(
                {
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
                },
                {
                    $set: { 'userSettings.$.deliveredAt': new Date() }
                }
            );

            // Add new entries if none exist
            await Messages.updateMany(
                {
                    chat: { $in: chatIds },
                    sender: { $ne: userId },
                    'userSettings.userId': { $ne: userId }
                },
                {
                    $push: {
                        userSettings: {
                            userId: userId,
                            deliveredAt: new Date()
                        }
                    }
                }
            );
        } catch (error) {
            console.log(`Got error in [updateDeliveredAt] for userId ${params?.userId} that is ${JSON.stringify(error)}`);
        }

 }


 export const fetchChatMessages = async (params:IGetMessages) => {
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
            }
           

            const totalRecords = await Messages.countDocuments(messagesQuery);
            let messages = await Messages.find(messagesQuery).populate('sender', '_id name profilePicture').populate('reply').sort({ createdAt: -1 }).skip(skipDocuments).limit(documentsLimit);
           let messagesnew = messages?.map((message:any) => {
                const otherUserSettings = message?.userSettings?.find((setting:any) => setting?.userId?.toString?.() !== userId?.toString?.());
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
                    reply: message?.reply ? {
                        _id: message?.reply?._id,
                        content: message?.reply?.content,
                        contentTitle: message?.reply?.contentTitle,
                        contentDescription: message?.reply?.contentDescription ?? '',
                        contentType: message?.reply?.contentType ?? 'text',
                        contentDescriptionType: message?.reply?.contentDescriptionType ?? 'text',
                    } : null
                }
            });
            
            const messageIds = messagesnew?.map((message: any) => message?.messageId);
            updateReadAt({ chatId, userId, messageIds });
            return {
                page: page,
                limit,
                total: totalRecords,
                messages: messagesnew,
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            return {
                messages: [],
                pageNo: 1,
                recordsPerPage: 20
            }
        }
};

export const updateReadAt = async (params:IMessageIds) => {
        try {
            const { chatId, userId, messageIds } = params;
            console.log(`updateReadAt called with params ${JSON.stringify(params)}`);
            // Update existing entries
            const updatedMessagesResponse = await Messages.updateMany(
                {
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
                },
                {
                    $set: { 'userSettings.$.readAt': new Date() }
                }
            );
            console.log(`Got updatedMessagesResponse that is ${JSON.stringify(updatedMessagesResponse)}`);
            // Add new entries if none exist
            const newEntryResponse = await Messages.updateMany(
                {
                    _id: { $in: messageIds },
                    chat: { $in: chatId },
                    'userSettings.userId': { $ne: userId }
                },
                {
                    $push: {
                        userSettings: {
                            userId: userId,
                            readAt: new Date(),
                            deliveredAt: new Date()
                        }
                    }
                }
            );
            console.log(`Got response of updatedMessagesResponse that is ${JSON.stringify(newEntryResponse)}`);
            return {
                success: true
            }
        } catch (error) {
            console.log(`caught error in updateReadAt that is ${error}`);
            return {
                success: false
            }
        }
}

export const editMessage = async (params: { messageId: string; userId: string; content: string }) => {
        try {
            console.log(`editMessage util called with params ${JSON.stringify(params)}`);
            const { messageId, userId, content } = params;
            const message: IgetMessageResponse | null = await Messages.findById(messageId).populate('reply').populate('sender');
            if (!message) {
                console.log(`Message with ID ${messageId} not found`);
                return {
                    success: false,
                    message: `Message with ID ${messageId} not found`
                }
            }
            if (message?.sender?._id?.toString?.() !== userId?.toString?.()) {
                console.log(`User ${userId} is not the sender of message ${messageId}`);
                return {
                    success: false,
                    message: `User ${userId} is not the sender of message ${messageId}`
                }
            }
            message.content = content;
            message.editedAt = new Date();
            await message.save();
            console.log(`Message ${messageId} edited successfully and new data is ${JSON.stringify(message)}`);
            return {
                success: true,
                data: message
            }
        } catch (error) {
            console.error(`Error editing message: ${error}`);
            return {
                success: false
            };
        }
    }



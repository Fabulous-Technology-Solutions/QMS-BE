import Messages from "../message/message.modal";
import {DeliveredMessage, ICreateChat} from "./chat.interfaces";
import ChatModel from "./chat.modal";

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
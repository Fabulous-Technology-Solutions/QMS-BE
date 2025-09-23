"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeliveredAt = exports.getAllChats = exports.deleteChatById = exports.getChatById = exports.getChatsByObj = exports.createChat = void 0;
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

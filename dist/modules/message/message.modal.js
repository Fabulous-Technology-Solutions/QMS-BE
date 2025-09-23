"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    chat: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    contentTitle: { type: String },
    content: { type: String, required: true },
    contentDescription: { type: String },
    contentDescriptionType: { type: String },
    contentType: { type: String },
    reactionsCount: { type: Map, of: Number, default: {} },
    userSettings: [
        {
            userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
            deliveredAt: { type: Date },
            isDeletedFrom2Reply: { type: Boolean, default: false },
            hasUserDeletedChat: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });
const Message = mongoose_1.default.model('Message', messageSchema);
exports.default = Message;

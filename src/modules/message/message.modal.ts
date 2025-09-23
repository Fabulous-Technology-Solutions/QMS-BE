import {IMessageDoc } from './message.interfaces';
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contentTitle: { type: String },
    content: { type: String, required: true },
    contentDescription: { type: String },
    contentDescriptionType: { type: String },
    contentType: { type: String },
    reactionsCount: { type: Map, of: Number, default: {} },
    userSettings: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          deliveredAt: { type: Date },
          isDeletedFrom2Reply: { type: Boolean, default: false },
          hasUserDeletedChat: { type: Boolean, default: false },
        },
      ],
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessageDoc>('Message', messageSchema);

export default Message;

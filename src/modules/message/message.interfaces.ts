import mongoose, { Document } from 'mongoose';

export interface IMessageDoc extends Document {
  chat: mongoose.Schema.Types.ObjectId;

  sender?: mongoose.Schema.Types.ObjectId;
  contentTitle?: string;
  content: string;
  contentDescription?: string;
  contentDescriptionType?: string;
  contentType?: string;
  reactionsCount?: Map<string, number>;
  userSettings?: Array<{
    userId: mongoose.Schema.Types.ObjectId;
    readAt?: Date;
    deliveredAt?: Date;
    deletedAt?: Date;
  }>;
}


export interface ICreateMessage {
  chat: string;

  sender?: string;
  contentTitle?: string;
  content?: string;
  contentDescription?: string;
  contentDescriptionType?: string;
  contentType?: string;
  reactionsCount?: Map<string, number>;
  userSettings?: Array<{
    userId: string;
    readAt?: Date;
    deliveredAt?: Date;
    deletedAt?: Date;
  }>;
}
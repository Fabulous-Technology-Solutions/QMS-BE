import mongoose, { Document } from "mongoose";

export interface ActivityModel extends Document {
  changes: Record<string, any>;
  performedBy: mongoose.Schema.Types.ObjectId;
  documentId: mongoose.Schema.Types.ObjectId;
  workspace?: mongoose.Schema.Types.ObjectId;
  collectionName: string;
  action: string;
  message?: string;
}

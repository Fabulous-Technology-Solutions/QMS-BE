import {ActivityModel} from "./activitylogs.interfaces";
import mongoose from 'mongoose';


const ActivityLogSchema = new mongoose.Schema<ActivityModel>(
  {
    changes: { type: Object, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    collectionName: { type: String, required: true },
    message: { type: String, default: null },
    action: { type: String, enum: ['post', 'put', 'delete', 'get', 'patch'], required: true },
    workspace:{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
ActivityLogSchema.index({ documentId: 1, collectionName: 1 });
const ActivityLog = mongoose.model<ActivityModel>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
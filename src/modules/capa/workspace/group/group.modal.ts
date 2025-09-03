import {IGroupModal} from "./group.interfaces"

import mongoose from "mongoose";
const GroupSchema = new mongoose.Schema<IGroupModal>({      
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});
const GroupModel = mongoose.model<IGroupModal>('Group', GroupSchema);
export default GroupModel;
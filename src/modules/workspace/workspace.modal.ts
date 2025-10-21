import mongoose from "mongoose";
import { ICapaworkspace } from "./workspace.interfaces";
const CapaworkspaceSchema = new mongoose.Schema<ICapaworkspace>({
    moduleId: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'Subscription' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'User' },
    name: { type: String, required: true },
    imageUrl: { type: String },
    imagekey: { type: String },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});


const CapaworkspaceModel = mongoose.model<ICapaworkspace>('Workspace', CapaworkspaceSchema);


export default CapaworkspaceModel;  
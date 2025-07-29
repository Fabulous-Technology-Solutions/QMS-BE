import mongoose from "mongoose";
import { ActionModel } from "./action.interfaces";

const actionSchema = new mongoose.Schema<ActionModel>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    type: { type: String, enum: ['preventive', 'corrective'], default: 'preventive' },
    endDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'on-hold'], default: 'pending' },
    docfile: { type: String, required: false },
    docfileKey: { type: String, required: false },
    cause: { type: mongoose.Schema.Types.ObjectId, ref: 'Causes', required: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Action = mongoose.model<ActionModel>('Action', actionSchema);

export default Action;

import mongoose from "mongoose";
import { ActionModel } from "./action.interfaces";

const actionSchema = new mongoose.Schema<ActionModel>({
    name: { type: String, required: true }, 
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true },
    endDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['open', 'in-progress','closed'], default: 'open' },
    budget: { type: Number},
    personnel: { type: String },
    docfile: { type: String, required: false },
    docfileKey: { type: String, required: false },
    cause: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskCauses'},
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Action = mongoose.model<ActionModel>('RiskAction', actionSchema);

export default Action;

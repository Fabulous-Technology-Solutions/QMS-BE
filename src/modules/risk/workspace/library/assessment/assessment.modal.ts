import { AssessmentModal } from "./assessment.interfaces";
import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema<AssessmentModal>({
    name: { type: String, required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    probability: { type: Number, enum: [1,2,3,4,5], required: true },
    impact: { type: Number, enum: [1,2,3,4,5], required: true },
    status: { type: String, enum: ['draft', 'reviewed', 'approved', 'rejected', 'pending'], default: 'draft' },
    approval:{
        type:Boolean,
        default:false
    },
    template: { type: String },
    templateKey: { type: String},
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const AssessmentModel = mongoose.model<AssessmentModal>('Assessment', AssessmentSchema);

export default AssessmentModel;

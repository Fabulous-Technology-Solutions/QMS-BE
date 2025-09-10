import { AssessmentModal } from "./assessment.interfaces";
import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema<AssessmentModal>({
    name: { type: String, required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'low-medium', 'high-medium'], required: true },
    probability: { type: String, enum: ['high-unlikely', 'low-unlikely', 'likely', 'possible', 'high-likely'], required: true },
    impact: { type: String, enum: ['not-significant', 'minor', 'moderate', 'major', 'severe'], required: true },
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

import { Document, ObjectId } from "mongoose";

export interface AssessmentModal extends Document {
    name: string;
    library: ObjectId;
    isDeleted: boolean; 
    createdBy: ObjectId;
    evaluator: ObjectId;
    template: String;
    templateKey: String;
    severity: String;
    probability: String;
    impact: String;
    status: String;
    approval:boolean;
}

export interface CreateAssessmentRequest {
    name: string;
    library: string;
    createdBy: string;
    evaluator: string;
    template: string;
    templateKey: string;
    severity: string;
    probability: string;
    impact: string;
    status: string;
    approval?:boolean;
}
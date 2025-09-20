import { Document, ObjectId } from "mongoose";

export interface AssessmentModal extends Document {
    name: string;
    library: ObjectId;
    isDeleted: boolean; 
    createdBy: ObjectId;
    evaluator: ObjectId;
    template: String;
    templateKey: String;
    probability: Number;
    impact: Number;
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
    probability: number;
    impact: number;
    status: string;
    approval?:boolean;
}
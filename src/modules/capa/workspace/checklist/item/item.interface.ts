import mongoose from "mongoose";

export interface CheckListItemModal extends mongoose.Document {
    question: string;
    checklist: mongoose.Schema.Types.ObjectId;
    evidence: string;
    evidenceKey: string;
    comment: string;
    isDelete: boolean;
}



export interface CreateCheckListItemRequest {
    question: string;
    checklist: mongoose.Schema.Types.ObjectId;
    evidence: string;
    evidenceKey: string;
    comment: string;
}
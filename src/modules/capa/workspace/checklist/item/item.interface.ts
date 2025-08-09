import mongoose from "mongoose";

export interface CheckListItemModal extends mongoose.Document {
    question: string;
    checklist: mongoose.Schema.Types.ObjectId;
    evidence: string;
    isDeleted:boolean;

}



export interface CreateCheckListItemRequest {
    question: string;
    checklist: mongoose.Schema.Types.ObjectId;

}
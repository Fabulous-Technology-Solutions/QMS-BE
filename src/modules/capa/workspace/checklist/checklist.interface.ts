import mongoose, { Document } from "mongoose";

export interface ChecklistModal extends Document { 
    name: string;
    description: string;
    workspace: mongoose.Types.ObjectId;
    isDelete:boolean

}

export interface CreateChecklistRequest {
    name: string;
    description: string;
    workspace: string;
}
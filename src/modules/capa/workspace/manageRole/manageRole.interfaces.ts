import mongoose, { Document } from 'mongoose';

export interface IRoleModal extends Document {
    name: string;
    description: string;
    permissions:  string[];  
    workspace: mongoose.Schema.Types.ObjectId;
    isDeleted: boolean;
}


export interface CreateRoleRequest {
    name: string;
    description: string;
    permissions: string[];
    workspace: string; 
}
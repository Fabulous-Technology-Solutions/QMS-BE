import mongoose, { Document } from 'mongoose';

export interface IRoleModal extends Document {
    name: string;
    description: string;
    permissions:  string;  
    workspace: mongoose.Schema.Types.ObjectId;
    isDeleted: boolean;
    processes: mongoose.Schema.Types.ObjectId[];
    sites: mongoose.Schema.Types.ObjectId[];
}


export interface CreateRoleRequest {
    name: string;
    description: string;
    permissions: string;
    workspace: string;
    processes: string[];
    sites: string[];
}


export interface getrolesQuery {
    workspace: string;
    search?: string;

    isDeleted?: boolean;
    name?: { $regex: string; $options: string };
}

export interface getParams {
    workspace: string;
    search?: string;
    page: number;
    limit: number;
    isDeleted?: boolean;
    name?: { $regex: string; $options: string };
}
import {  IUserDoc} from '@/modules/user/user.interfaces';
import mongoose, { Document } from 'mongoose';

export interface ICapaworkspace extends Document {
    moduleId: mongoose.Schema.Types.ObjectId;
    createdBy: mongoose.Schema.Types.ObjectId;
    name: string;
    imageUrl: string;
    imagekey: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface CreateCapaworkspaceRequest {
    moduleId: string;
    name: string;
    imageUrl: string;
    imagekey: string;
    description: string;    
}

export interface getworkspacesofuserRequest {
   moduleId: string;
   Page: any;
   Limit: any;
   user:IUserDoc
}



export interface IqueryofGetworkspaces {
    moduleId: mongoose.Types.ObjectId;
    createdBy?: mongoose.Types.ObjectId;
}
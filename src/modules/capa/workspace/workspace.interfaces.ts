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
    isDeleted: boolean;
}



export interface CreateCapaworkspaceRequest {
    moduleId: string;
    name: string;
    imageUrl: string;
    imagekey: string;
    description: string;    

}
export interface CreateCapaworkspaceServiceFunction extends CreateCapaworkspaceRequest {
    user: IUserDoc;
     
}

export interface getworkspacesofuserRequest {
   moduleId: string;
   Page: any;
   Limit: any;
   user:IUserDoc
   search?: string;
  
}



export interface IqueryofGetworkspaces {
    moduleId: mongoose.Types.ObjectId;
    createdBy?: mongoose.Types.ObjectId;
    isDeleted: boolean,
     _id?: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
    name?: { $regex: string; $options: string }; // For search functionality
}

export interface IMAP{
     method: mongoose.Types.ObjectId;
        workspacePermissions: mongoose.Types.ObjectId[];

}
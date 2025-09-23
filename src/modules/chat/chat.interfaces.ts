import mongoose, { Document } from "mongoose";

 
 export interface IChatDoc extends  Document {
   obj?: mongoose.Schema.Types.ObjectId;
   chatOf?:string;
    workspace?: mongoose.Schema.Types.ObjectId;
 }

 export interface ICreateChat  {
   obj?: string;
   chatOf?:string;
   workspace?: string;
 }

 export interface DeliveredMessage {
 chatIds: string[];
 userId: string;
}
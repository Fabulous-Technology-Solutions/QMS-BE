import mongoose, { Document } from "mongoose";

 
 export interface IChatDoc extends  Document {
   obj?: mongoose.Schema.Types.ObjectId;
   chatOf?:string;
 }

 export interface ICreateChat  {
   obj?: string;
   chatOf?:string;
 }
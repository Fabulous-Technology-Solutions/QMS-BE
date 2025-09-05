import { Document, ObjectId } from "mongoose";

export interface Consequence extends Document {
  library: ObjectId;
  name: string;
  description: string;
  createdBy: ObjectId;
}

export interface ConsequenceInput {
  library: string;
  name: string;
  description: string;
  createdBy: string;
}
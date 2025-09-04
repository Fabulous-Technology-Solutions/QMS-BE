import { Document, Types } from 'mongoose';

export interface ControlModal extends Document {
  name: string;
  library: Types.ObjectId;
  description: string;
  controlType: string;
  effectiveness: string;
  owners: Types.ObjectId[];
  createdBy: Types.ObjectId;
}

export interface CreateControl {
  library: Types.ObjectId;
  description: string;
  controlType: string;
  effectiveness: string;
  owners: Types.ObjectId[];
  name: string;
}

export interface GetControlQuery {
  library: string;
  $or?: { name?: { $regex: string; $options: string }; description?: { $regex: string; $options: string } }[];

}

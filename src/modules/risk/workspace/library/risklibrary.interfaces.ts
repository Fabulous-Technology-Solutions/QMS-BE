import mongoose, { Document, ObjectId } from 'mongoose';

export interface LibraryModal extends Document {
  name: string;
  description: string;
  site: ObjectId;
  process: ObjectId;
  workspace: ObjectId;
  createdBy: ObjectId;
  isDeleted: boolean;
  deletedBy?: ObjectId;
  deletedAt?: Date;
  members: ObjectId[];
  managers: ObjectId[];
  category?: string;
  dateIdentified?: Date;
  assessmentApproval: {
    status: 'Reviewed' | 'Approved' | 'Draft';
    feedback: string;
  };
  riskappetite?: number;
}

export interface UpdateContainmentRequest {
  responsibles?: string[];
  description?: string;
  dueDate?: Date;
}

export interface CreateLibraryRequest {
  name: string;
  description: string;
  site: string;
  process: string;
  workspace: string;
  createdBy: string;
  riskappetite?: number;
  members?: string[];
  managers?: string[];
  assessmentApproval?: {
    status?: 'Reviewed' | 'Approved' | 'Draft';
    feedback?: string;
  };
  category?: string;
  dateIdentified?: String;
}

export interface GetLibrariesQuery {
  workspace: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  status?: string;
  $or?: [{ name: { $regex: string; $options: string } }, { description: { $regex: string; $options: string } }];
}

export interface forIncludes {
  _id: ObjectId;
  name: string;
  email: string;
  profilePicture: string;
}

export interface GetLibrariesQueryforUser {
  managers: {
    $in: mongoose.Types.ObjectId[];
  };
  workspace: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  $or?: [{ name: { $regex: string; $options: string } }, { description: { $regex: string; $options: string } }];
}

export interface AdminBelongtoLibrary {
  _id: mongoose.Types.ObjectId;
  isDeleted: false;
  managers?: {
    $in: ObjectId[];
  };
}

export interface SubAdminBelongtoLibrary {
  'libraries._id': mongoose.Types.ObjectId;
  'libraries.isDeleted': boolean;
  'libraries.managers'?: {
    $in: mongoose.Types.ObjectId[];
  };
}

import mongoose, { Document, ObjectId } from 'mongoose';

export interface LibraryModal extends Document {
  
  name: string;
  description: string;
  site: ObjectId[];
  processdata: {
    process: ObjectId;
    subProcess: string[];
  };
  endDate: Date | null;
  workspace: ObjectId;
  createdBy: ObjectId;
  isDeleted: boolean;
  deletedBy?: ObjectId;
  deletedAt?: Date;
  status: string;
  members: ObjectId[];
  managers: ObjectId[];
  priority: string;
  Form5W2H: {
    what: string;
    why: string;
    when: string;
    where: string;
    who: string;
    how: string;
  };
  containment: {
    responsibles: ObjectId[];
    description: string;
    dueDate: Date;
    status: boolean;
  };
}

export interface UpdateForm5W2HRequest {
  what?: string;
  why?: string;
  when?: string;
  where?: string;
  who?: string;
  how?: string;
  howImpacted?: string;
}

export interface UpdateContainmentRequest {
  responsibles?: string[];
  description?: string;
  dueDate?: Date;
}

export interface CreateLibraryRequest {
  name: string;
  endDate: Date | null;
  description: string;
  site: string[];
  processdata: {
    process: string;
    subProcess: string[];
  };
  workspace: string;
  createdBy: string;
  status: string;
  members?: string[];
  managers?: string[];
  priority?: string;
  containment?: {
    status?: boolean;
    description?: string;
    dueDate?: Date;
    responsibles?: string[];
  };
  Form5W2H?: {
    what?: string;
    why?: string;
    when?: string;
    where?: string;
    who?: string;
    how?: string;
    howImpacted?: string;
  };
  moduleId?: string;
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
    $in: mongoose.Types.ObjectId[]
  },
  workspace: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  $or?: [{ name: { $regex: string; $options: string } },
    { description: { $regex: string; $options: string } }];
}

export interface AdminBelongtoLibrary {
  _id: mongoose.Types.ObjectId,
  isDeleted: false,
  managers?: {
    $in: ObjectId[]
  }
}

export interface SubAdminBelongtoLibrary {

  'libraries._id': mongoose.Types.ObjectId;
  'libraries.isDeleted': boolean;
  'libraries.managers'?: {
    $in: mongoose.Types.ObjectId[];
  };
}


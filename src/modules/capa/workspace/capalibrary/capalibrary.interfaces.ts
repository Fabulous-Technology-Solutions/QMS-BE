import mongoose, { Document, ObjectId } from 'mongoose';

export interface LibraryModal extends Document {
  name: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  workspace: ObjectId;
  createdBy: ObjectId;
  isDeleted: boolean;
  status: string;
  members: ObjectId[];
  managers: ObjectId[];
  priority: string;
  Form5W2H: {
    containment: boolean;
    what: string;
    why: string;
    when: string;
    where: string;
    who: string;
    how: string;
  };

}

export interface UpdateForm5W2HRequest {
  containment?: boolean;
  what?: string;
  why?: string;
  when?: string;
  where?: string;
  who?: string;
  how?: string;
}



export interface CreateLibraryRequest {
  name: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  workspace: string;
  createdBy: string;
  status: string;
  members?: string[];
  managers?: string[];
  priority?: string;
}

export interface GetLibrariesQuery {
  workspace: mongoose.Types.ObjectId;
  isDeleted?: boolean;
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


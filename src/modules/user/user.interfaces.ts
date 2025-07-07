import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';


export interface IUser {

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact?: string;
  role: string;
  isEmailVerified: boolean;
  providers: string[];
  googleId?: string;
  stripeCustomerId?: string;
  
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
  ownerId:mongoose.Schema.Types.ObjectId
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
export interface ISubAdmin extends IUser {
  createdBy: mongoose.Schema.Types.ObjectId;
  adminOF: mongoose.Schema.Types.ObjectId[];
  permissions: string[];
}

export interface ISubAdminDoc extends ISubAdmin, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified' | 'stripeCustomerId'>;


export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}

export interface CreateNewUser extends IUser {
  permissions: string[];
  adminOF?: string[];
  subAdminRole: string;
  createdBy?: mongoose.Schema.Types.ObjectId;
  ownerId?:mongoose.Schema.Types.ObjectId;
}
export type NewCreatedUser = Omit<CreateNewUser, 'isEmailVerified' | 'stripeCustomerId'>;

export interface IwithId extends IUserDoc {

}
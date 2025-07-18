import  User  from '../../../user/user.model';
import AppiError from '../../../errors/ApiError';
import CapaworkspaceModel from '../workspace.modal';
import { CreateRoleRequest } from './manageRole.interfaces';
import RoleModal from './manageRole.modal';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

export const createRole = (data: CreateRoleRequest) => {
  const role = new RoleModal({
    name: data.name,
    description: data.description,
    permissions: data.permissions,
    workspace: data.workspace,
  });
  return role.save();
};

export const updateRole = async (id: string, data: Partial<CreateRoleRequest>) => {
  const role = await RoleModal.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });
  if (!role) {
    throw new AppiError('Role not found', httpStatus.NOT_FOUND);
  }
  return role.save();
};

export const deleteRole = async (id: string) => {
  const role = await RoleModal.findOne({ _id: id, isDeleted: false });
  if (!role) {
    throw new AppiError('Role not found', httpStatus.NOT_FOUND);
  }
  role.isDeleted = true;
  return role.save();
};

export const getRoleById = async (id: string) => {
  const role = await RoleModal.findOne({ _id: id, isDeleted: false }).populate('workspace');
  if (!role) {
    throw new AppiError('Role not found', httpStatus.NOT_FOUND);
  }
  return role;
};

export const getworkspaceRoles = async (workspaceId: string) => {
  return await RoleModal.find({ workspace: workspaceId, isDeleted: false })
};

export const checkAdminBelongsToWorkspace = async (
  userId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId
) => {
  const user = await CapaworkspaceModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(workspaceId), isDeleted: false },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'moduleId',
        foreignField: '_id',
        as: 'subscription',
      },
    },
    {
      $unwind: '$subscription',
    },
    {
      $match: { 'subscription.userId': new mongoose.Types.ObjectId(userId) },
    },
  ]);
  console.log("User found in workspace:", user);
  if (!user || user.length === 0) {
    throw new AppiError('User does not belong to the workspace', httpStatus.FORBIDDEN);
  }
  return user;
};

export const checkWorkSubadminBelongsToWorkspace = async (
  userId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId
) => {
const user = await User.findOne({
  _id: userId,
  adminOf: {
    $elemMatch: {
      workspacePermissions: workspaceId
    }
  },
  isDeleted: false
});

  if (!user) {
    throw new AppiError('User does not belong to the workspace', httpStatus.FORBIDDEN);
  }
  return user;
};


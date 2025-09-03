import  User  from '../../../user/user.model';
import AppiError from '../../../errors/ApiError';
import CapaworkspaceModel from '../../../workspace/workspace.modal';
import { CreateRoleRequest, getParams, getrolesQuery } from './manageRole.interfaces';
import RoleModal from './manageRole.modal';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

export const createRole = (data: CreateRoleRequest) => {
  const role = new RoleModal({
    name: data.name,
    description: data.description,
    permissions: data.permissions,
    workspace: data.workspace,
    process: data.process,
    site: data.site
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
  const role = await RoleModal.findOne({ _id: id, isDeleted: false }).populate('workspace').populate('process','name').populate('site','name');
  if (!role) {
    throw new AppiError('Role not found', httpStatus.NOT_FOUND);
  } 
  return role;
};

export const  getworkspaceRoles = async (data: getParams) => {
  const { workspace, search, page, limit } = data;
  const query: getrolesQuery = { workspace: workspace, isDeleted: false, };
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  const roles = await RoleModal.find(query).populate('process','name').populate('site','name').skip((page - 1) * limit).limit(limit);
  const total = await RoleModal.countDocuments(query);
  return {
    total,
    roles,
    page,
  };
};

export const getworkspacerolenames = async (workspaceId: string) => {
  const roles = await RoleModal.find({ workspace: workspaceId, isDeleted: false }).select('name');
  if (!roles || roles.length === 0) {
    throw new AppiError('No roles found for this workspace', httpStatus.NOT_FOUND);
  }
  return roles;
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
  
  if (!user || user?.length === 0) {
    throw new AppiError('User does not belong to the workspace', httpStatus.FORBIDDEN);
  }
  return user;
};

export const checkWorkSubadminBelongsToWorkspace = async (
  userId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId
) => {


const findworkspace = await CapaworkspaceModel.findOne({
  _id: workspaceId,
  isDeleted: false
});
if (!findworkspace) {
    throw new AppiError('Workspace not found', httpStatus.NOT_FOUND);
  }

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


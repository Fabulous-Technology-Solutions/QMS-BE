import AppiError from '@/modules/errors/ApiError';
import { CreateRoleRequest } from './manageRole.interfaces';
import RoleModal from './manageRole.modal';
import httpStatus from 'http-status';

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
const role = await RoleModal.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: true }
);
if (!role) {
    throw new AppiError('Role not found', httpStatus.NOT_FOUND);
}
  return role.save();
};

export const deleteRole= async (id: string) => {
  const role = await RoleModal.findOne({ _id: id, isDeleted: false });
  if (!role) {
    throw new AppiError('Role not found', httpStatus.NOT_FOUND);
  }
  role.isDeleted = true;
  return role.save();
}


export const getRoleById = async (id: string) => {
  const role = await RoleModal.findOne({ _id: id, isDeleted: false }).populate('workspace');
  if (!role) {
     throw new AppiError('Role not found', httpStatus.NOT_FOUND);
  }
  return role;
}   


export const getworkspaceRoles = async (workspaceId: string) => {
  return await RoleModal.find({ workspace: workspaceId, isDeleted: false }).populate('workspace');
}
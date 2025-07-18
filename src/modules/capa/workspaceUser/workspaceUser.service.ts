import workspaceUser from "./workspaceUser.modal";

import {CreateWorkspaceUserRequest} from "./workspaceUser.interfaces";


export const createWorkspaceUser = async (data: CreateWorkspaceUserRequest) => {
  const user = new workspaceUser({
    workspaceId: data.workspaceId,
    roleId: data.roleId,
    name: data.name,
    email: data.email,
    status: data.status,
    profilePicture: data.profilePicture,
  });
  return user.save();
}

export const updateWorkspaceUser = async (id: string, data: Partial<CreateWorkspaceUserRequest>) => {
  const user = await workspaceUser.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user.save();
};

export const deleteWorkspaceUser = async (id: string) => {
  const user= await workspaceUser.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user.save();
};

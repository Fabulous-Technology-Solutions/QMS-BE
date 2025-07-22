import workspaceUser from "./workspaceUser.modal";

import { CreateWorkspaceUserRequest } from "./workspaceUser.interfaces";
import User from "../../user/user.model";
import  ApiError  from "../../errors/ApiError";
import httpStatus from "http-status";
import { tokenService } from "@/modules/token";
import { sendEmail } from "@/modules/email/email.service";


export const createWorkspaceUser = async (data: CreateWorkspaceUserRequest) => {
  if (await User.isEmailTaken(data.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  const inviteToken = await tokenService.generateInviteToken(data.email);
  const inviteUrl = `${process.env["CLIENT_URL"]}/invite?email=${encodeURIComponent(data.email)}&token=${inviteToken}`;
  const htmlbodyforsendpassword = `
      <p>Welcome to Tellust, ${data.name}!</p>
      <p>Email: ${data.email}</p>
      <p>Please click the button below to accept your invitation and set your password or proceed with Google:</p>
      <a href="${inviteUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Accept Invitation</a>
      <p>If you did not expect this invitation, you can ignore this email.</p>
    `;
  sendEmail(data.email, 'Welcome to Tellust! Accept Your Invitation', "", htmlbodyforsendpassword)
  const user = new workspaceUser({
    workspaceId: data.workspace,
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
  const user = await workspaceUser.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user.save();
};


export const getWorkspaceUsers = async (workspaceId: string) => {
  const users = await workspaceUser.find({ workspaceId, isDeleted: false });
  return users;
}
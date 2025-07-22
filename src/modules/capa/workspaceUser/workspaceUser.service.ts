import workspaceUser from './workspaceUser.modal';

import { CreateWorkspaceUserRequest } from './workspaceUser.interfaces';
import User from '../../user/user.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import * as tokenService from '../../token/token.service';
import { sendEmail } from '../../email/email.service';

import mongoose  from 'mongoose';
import { deleteMedia } from '@/modules/upload/upload.middleware';

export const createWorkspaceUser = async (data: CreateWorkspaceUserRequest) => {
  if (await User.isEmailTaken(data.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  const user = new workspaceUser({
    workspace: data.workspace,
    roleId: data.roleId,
    name: data.name,
    email: data.email,
    status: data.status,
    profilePicture: data.profilePicture,
  });
  await user.save();
  const inviteToken = await tokenService.generateInviteToken(data.email);
  const inviteUrl = `${process.env['CLIENT_URL']}/invite?email=${encodeURIComponent(data.email)}&token=${inviteToken}`;
  const htmlbodyforsendpassword = `
      <p>Welcome to Tellust, ${data.name}!</p>
      <p>Email: ${data.email}</p>
      <p>Please click the button below to accept your invitation and set your password or proceed with Google:</p>
      <a href="${inviteUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Accept Invitation</a>
      <p>If you did not expect this invitation, you can ignore this email.</p>
    `;
  sendEmail(data.email, 'Welcome to Tellust! Accept Your Invitation', '', htmlbodyforsendpassword);

  return user;
};

export const updateWorkspaceUser = async (id: string, data: Partial<CreateWorkspaceUserRequest>) => {
  // Find and update the user in a single request, returning the old document
  const user = await workspaceUser.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: false } // return the old document before update
  );

  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }


  
  // If profile picture is being updated, delete the old one if needed
  if (data.profilePicture && data.profilePictureKey && user.profilePictureKey && user.profilePictureKey !== data.profilePictureKey) {
    deleteMedia(user.profilePictureKey);
  }

  // Now get the updated user
  const updatedUser = await workspaceUser.findById(id);
  return updatedUser?.save();
};

export const deleteWorkspaceUser = async (id: string) => {
  const user = await workspaceUser.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user.save();
};

export const getWorkspaceUsers = async (
  workspaceId: string,
  page: number,
  limit: number,
  search: string
) => {
  const match: any = { workspace: new mongoose.Types.ObjectId(workspaceId), isDeleted: false };

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    match.$or = [
      { name: regex },
      { email: regex },
    ];
  }

  const users = await workspaceUser.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'role',
      },
    },
    {
      $unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        status: 1,
        profilePicture: 1,
        role: {
          _id: '$role._id',
          name: '$role.name',
        },
      },
    },
    { $sort: { name: 1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  const total = await workspaceUser.countDocuments(match);

  return { users, total , page, limit };
};

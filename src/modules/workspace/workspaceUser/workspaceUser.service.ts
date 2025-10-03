import workspaceUser from './workspaceUser.modal';

import { CreateWorkspaceUserRequest } from './workspaceUser.interfaces';
import User from '../../user/user.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import * as tokenService from '../../token/token.service';
import { sendEmail } from '../../email/email.service';

import mongoose from 'mongoose';
import { deleteMedia } from '../../upload/upload.middleware';
import AccountModel from '../../account/account.modal';

export const createWorkspaceUser = async (data: CreateWorkspaceUserRequest) => {
  if (await User.isEmailTaken(data.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  const user = new workspaceUser({
    workspace: data.workspace,
    roleId: data.roleId,
    name: data.name,
    email: data.email,
    role: 'workspaceUser',
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

  console.log('Updating workspace user with data:', data);

  const user = await workspaceUser.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: false } // return the old document before update
  );
  console.log(' user with data:', user);

  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }

  // If profile picture is being updated, delete the old one if needed
  if (
    data.profilePicture &&
    data.profilePictureKey &&
    user.profilePictureKey &&
    user.profilePictureKey !== data.profilePictureKey
  ) {
    deleteMedia(user.profilePictureKey);
  }

  // Now get the updated user
  const updatedUser = await workspaceUser.findById(id);
  if (!updatedUser) {
    throw new ApiError('User not found after update', httpStatus.NOT_FOUND);
  }
  return updatedUser?.save();
};

export const getworkspaceusersnames = async (workspaceId: string) => {
  const users = await AccountModel.aggregate([
    {
      $match: {
        'Permissions.workspace': new mongoose.Types.ObjectId(workspaceId),
      },
    },
    {
      $addFields: {
        permission: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$Permissions',
                cond: { $eq: ['$$this.workspace', new mongoose.Types.ObjectId(workspaceId)] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        roleId: '$permission.roleId',
        workspace: '$permission.workspace',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'workspaceRole',
      },
    },
    {
      $unwind: {
        path: '$workspaceRole',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: '$user.name',
        profilePicture: '$user.profilePicture',
      },
    },
  ]);
  return users;
};

export const deleteWorkspaceUser = async (id: string) => {
  const user = await workspaceUser.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user.save();
};

export const getWorkspaceUsers = async (workspaceId: string, page: number, limit: number, search: string) => {
  console.log('Fetching users for workspace:', workspaceId, 'Page:', page, 'Limit:', limit, 'Search:', search);

  const matchStage = {
    $match: {
      'Permissions.workspace': new mongoose.Types.ObjectId(workspaceId),
    },
  };

  const pipeline = [
    matchStage,
    {
      $addFields: {
        permission: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$Permissions',
                cond: { $eq: ['$$this.workspace', new mongoose.Types.ObjectId(workspaceId)] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        roleId: '$permission.roleId',
        workspace: '$permission.workspace',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'workspaceRole',
      },
    },
    {
      $unwind: {
        path: '$workspaceRole',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: '$user.name',
        email: '$user.email',
        status: 1,
        role:'$workspaceRole',
        workspaceRole: '$permission.permission',
        workspace: 1,
        profilePicture: '$user.profilePicture',
        Accountrole: '$role',
      },
    },
  ];

  const [users, totalCount] = await Promise.all([
    AccountModel.aggregate([...pipeline, { $sort: { name: 1 } }, { $skip: (page - 1) * limit }, { $limit: limit }]),
    AccountModel.aggregate([...pipeline, { $count: 'total' }]).then((result) => result[0]?.total || 0),
  ]);

  return { users, page, limit, total: totalCount };
};

export const getSingleWorkspaceUser = async (userId: string) => {
  const user = await workspaceUser.findOne({ _id: userId, isDeleted: false }).populate('roleId', 'name');
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};

import mongoose, { ObjectId } from 'mongoose';
import { CreateGroupRequest, GetGroupsParams } from './group.interfaces';
import GroupModel from './group.modal';
import { AccountModel } from '../../account';

export const CreateGroup = async (groupData: CreateGroupRequest) => {
  const group = new GroupModel(groupData);
  return await group.save();
};

export const getGroupById = async (groupId: string) => {
  const result = await GroupModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(groupId) } },
    {
      $lookup: {
        from: 'accounts',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
          },
          { $unwind: { path: '$user' } },
          {
            $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
          },
        ],
      },
    },
  ]);
  return result[0] || null;
};

export const getGroupsByWorkspace = async (body: GetGroupsParams) => {
  const matchStage: any = {
    workspace:  new mongoose.Types.ObjectId(body.workspace),
    isDeleted: false,
  };

  if (body.search) {
    matchStage.name = { $regex: body.search, $options: 'i' };
  }

  const skip = (body.page - 1) * body.limit;
  const limit = body.limit;
  console.log('Match Stage:', matchStage);

  const pipeline = [
    { $match: matchStage },

    // Lookup members from users collection
    {
      $lookup: {
        from: 'accounts',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
          },
          { $unwind: { path: '$user' } },
          {
            $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
          },
        ],
      },
    },

    // Project only specific member fields
    {
      $project: {
        name: 1,
        workspace: 1,
        description: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        isDeleted: 1,
        members: {
          name: 1,
          email: 1,
          profilePicture: 1,
          _id: 1
        },
      },
    },

    // Pagination
    { $skip: skip },
    { $limit: limit },
  ];

  const data = await GroupModel.aggregate(pipeline);

  // Get total count separately
  const totalResult = await GroupModel.aggregate([{ $match: matchStage }, { $count: 'total' }]);

  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  return {
    data,
    total,
    page: body.page,
    limit: body.limit,
    success: true,
    message: 'Groups retrieved successfully',
  };
};

export const updateGroup = async (groupId: string, updateData: Partial<CreateGroupRequest>) => {
  return await GroupModel.findByIdAndUpdate(groupId, updateData, { new: true }).populate(
    'members',
    'name email profilePicture'
  );
};

export const deleteGroup = async (groupId: string) => {
  return await GroupModel.findByIdAndUpdate(groupId, { isDeleted: true }, { new: true });
};

export const getGroupsNames = async (workspaceId: string) => {
  return await GroupModel.find({ workspace: workspaceId, isDeleted: false }, 'name');
};

export const addMemberToGroup = async (groupId: string, memberId: ObjectId) => {
  // Ensure the group exists before adding a member
  const group = await getGroupById(groupId);
  if (!group) {
    throw new Error('Group not found');
  }
  // check if the member is already in the group
  if (group.members.includes(memberId)) {
    throw new Error('Member is already in the group');
  }

  return await GroupModel.findByIdAndUpdate(groupId, { $addToSet: { members: memberId } }, { new: true });
};

export const removeMemberFromGroup = async (groupId: string, memberId: string) => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  console.log('Group members:', group.members);
  console.log('Member ID to remove:', new mongoose.Types.ObjectId(memberId));

  const memberObjectId = new mongoose.Types.ObjectId(memberId);
  console.log('Members in groups:', group.members);

  // Compare ObjectIds as strings
  const memberExists = group.members.some((m: any) => m['_id'].toString() === memberObjectId.toString());

  if (!memberExists) {
    throw new Error('Member is not in the group');
  }

  return await GroupModel.findByIdAndUpdate(groupId, { $pull: { members: memberObjectId } }, { new: true }).populate(
    'members',
    'name email profilePicture'
  );
};

export const getGroupUsers = async (groupId: string, search: string = '', page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const matchRegex = new RegExp(search, 'i');

  // Find the group
  const group = await GroupModel.findById(groupId).lean();
  if (!group) {
    throw new Error('Group not found');
  }

  const pipeline: any[] = [
    {
      $match: {
        _id: { $in: group.members }, // group.members must be Account IDs
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user', // field inside AccountModel
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 1,
        status: 1, // account id
        name: '$user.name',
        email: '$user.email',
        profilePicture: '$user.profilePicture',
      },
    },
    {
      $match: {
        ...(search && {
          $or: [{ name: { $regex: matchRegex } }, { email: { $regex: matchRegex } }],
        }),
      },
    },
    {
      $facet: {
        members: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const result = await AccountModel.aggregate(pipeline);

  const members = result[0]?.members || [];
  const total = result[0]?.total[0]?.count || 0;

  return {
    group,
    members,
    total,
    page,
    limit,
  };
};

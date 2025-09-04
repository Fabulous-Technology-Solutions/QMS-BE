import mongoose, { ObjectId } from 'mongoose';
import { CreateGroupRequest, GetGroupsParams, GetGroupsQuery } from './group.interfaces';
import GroupModel from './group.modal';
import User from '../../user/user.model';

export const CreateGroup = async (groupData: CreateGroupRequest) => {
  const group = new GroupModel(groupData);
  return await group.save();
};

export const getGroupById = async (groupId: string) => {
  return await GroupModel.findById(groupId).populate('members', 'name email profilePicture');
};

export const getGroupsByWorkspace = async (body: GetGroupsParams) => {
  const query: GetGroupsQuery = { workspace: body.workspace, isDeleted: false };
  if (body.search) {
    query.name = { $regex: body.search, $options: 'i' };
  }

  const data = await GroupModel.find(query)
    .skip((body.page - 1) * body.limit)
    .limit(body.limit)
    .populate('members', 'name email profilePicture');
  const total = await GroupModel.countDocuments(query);
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

  return await GroupModel.findByIdAndUpdate(groupId, { $addToSet: { members: memberId } }, { new: true }).populate(
    'members',
    'name email profilePicture'
  );
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
  const memberExists = group.members.some((m: any) =>
    m["_id"].toString() === memberObjectId.toString()
  );

  if (!memberExists) {
    throw new Error('Member is not in the group');
  }

  return await GroupModel.findByIdAndUpdate(
    groupId,
    { $pull: { members: memberObjectId } },
    { new: true }
  ).populate('members', 'name email profilePicture');
};

export const getGroupUsers = async (groupId: string, search: string = '', page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const matchRegex = new RegExp(search, 'i');

  const group = await GroupModel.findById(groupId).lean();
  if (!group) {
    throw new Error('Group not found');
  }

  const pipeline: any[] = [
    {
      $match: {
        _id: { $in: group.members },
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

  const result = await User.aggregate(pipeline);
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

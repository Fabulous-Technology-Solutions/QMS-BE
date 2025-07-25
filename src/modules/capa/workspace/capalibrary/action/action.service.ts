
import { CreateActionRequest } from './action.interfaces';
import Action from './action.modal';
import mongoose from 'mongoose';

export const createAction = async (data: CreateActionRequest) => {
  const action = new Action(data);
  await action.save();
  return action;
};

export const getActionById = async (actionId: string) => {
  const action = await Action.findOne({ _id: actionId, isDeleted: false })
    .populate('createdBy', 'name email profilePicture')
    .populate('assignedTo', 'name email profilePicture')
    .populate('library', 'name description');

  if (!action) {
    throw new Error('Action not found');
  }
  return action;
};

export const updateAction = async (actionId: string, data: Partial<CreateActionRequest>) => {
  const action = await Action.findOneAndUpdate({ _id: actionId, isDeleted: false }, data, { new: true });
  if (!action) {
    throw new Error('Action not found');
  }
  return action;
};

export const getLibraryMembersByAction = async (
  actionId: string = '',
  search: string = '',
  page: number = 1,
  limit: number = 10
) => {
  const result = await Action.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(actionId), isDeleted: false } },
    {
      $lookup: {
        from: 'libraries', // replace with your actual library collection name
        localField: 'library',
        foreignField: '_id',
        as: 'library',
      },
    },
    { $unwind: '$library' },
    { $project: { members: '$library.members' } },
    { $unwind: '$members' },
    ...(search
      ? [
          {
            $match: {
              $or: [
                { 'members.name': { $regex: search, $options: 'i' } },
                { 'members.email': { $regex: search, $options: 'i' } },
              ],
            },
          },
        ]
      : []),
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);
  if (!result.length) {
    throw new Error('Action not found');
  }
  const members = result[0].data;
  const totalCount = result[0].totalCount[0]?.count || 0;
  return { members, totalCount, page, limit };
};

export const getActionsByLibrary = async (libraryId: string) => {
  const actions = await Action.aggregate([
    { $match: { library: new mongoose.Types.ObjectId(libraryId), isDeleted: false } },
    {
      $lookup: {
        from: 'libraries',
        localField: 'library',
        foreignField: '_id',
        as: 'library',
      },
    },
    { $unwind: '$library' },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        createdBy: { name: 1, email: 1, profilePicture: 1 },
        assignedTo: [{ name: 1, email: 1, profilePicture: 1 }],
        library: { name: 1, description: 1 },
      },
    },
  ]);
  return actions;
};

export const deleteAction = async (actionId: string) => {
  const action = await Action.findOneAndUpdate({ _id: actionId, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!action) {
    throw new Error('Action not found');
  }
  return action;
};

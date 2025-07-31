import mongoose from 'mongoose';
import { CreateChecklistRequest } from './checklist.interface';
import Checklist from './checklist.modal';

const createCheckList = async (data: CreateChecklistRequest) => {
  const checklist = new Checklist(data);
  await checklist.save();
  return checklist;
};

const getCheckListById = async (checklistId: string) => {
  const checklist = await Checklist.findOne({ _id: checklistId, isDelete: false }).populate('workspace', 'name description');

  if (!checklist) {
    throw new Error('Checklist not found');
  }
  return checklist;
};
const updateCheckList = async (checklistId: string, data: Partial<CreateChecklistRequest>) => {
  const checklist = await Checklist.findOneAndUpdate({ _id: checklistId, isDelete: false }, data, { new: true });
  if (!checklist) {
    throw new Error('Checklist not found');
  }
  return checklist;
};

const deleteCheckList = async (checklistId: string) => {
  const checklist = await Checklist.findOneAndUpdate({ _id: checklistId }, { isDelete: true }, { new: true });
  if (!checklist) {
    throw new Error('Checklist not found');
  }
  return checklist;
};

const getCheckListByWorkspaceId = async (workspaceId: string, search: string , page: number, limit: number) => {
  const match: any = {
    workspace: new mongoose.Types.ObjectId(workspaceId),
    isDelete: false,
  };

  if (search) {
    match.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  }
console.log("limit", limit);
  console.log("page", page);
  const results = await Checklist.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'workspace',
        foreignField: '_id',
        as: 'workspace',
      },
    },
    { $unwind: { path: '$workspace' ,preserveNullAndEmptyArrays: true} },
    {
      $project: {
        name: 1,
        description: 1,
        workspace: { name: 1, description: 1 },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
  const total = await Checklist.countDocuments(match);
  return {
    data: results,
    total,
    page,
    limit,
  };
};

const getCheckListNamesByWorkspaceId = async (workspaceId: string) => {
  const checklists = await Checklist.find({ workspace: workspaceId, isDelete: false }).select('name');

  return checklists;
};

export { createCheckList, getCheckListById, updateCheckList, deleteCheckList, getCheckListByWorkspaceId, getCheckListNamesByWorkspaceId };

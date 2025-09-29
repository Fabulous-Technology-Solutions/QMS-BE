import mongoose from 'mongoose';
import {
  CreateCapaworkspaceRequest,
  CreateCapaworkspaceServiceFunction,
  getworkspacesofuserRequest,
  IMAP,
  IqueryofGetworkspaces,
} from './workspace.interfaces';
import CapaworkspaceModel from './workspace.modal';

import { LibraryModel } from '../capa/workspace/capalibrary/capalibrary.modal';
import Action from '../capa/workspace/capalibrary/action/action.modal';

export const createCapaworkspace = async (data: CreateCapaworkspaceServiceFunction) => {
  const { moduleId, name, imageUrl, imagekey, description, user } = data;

  const workspace = new CapaworkspaceModel({
    moduleId,
    name,
    imageUrl,
    imagekey,
    description,
    createdBy: user._id,
  });
  if (user.role !== 'admin') {
    (user.adminOF as IMAP[] | undefined)?.forEach((admin: IMAP) => {
      if (admin.method.equals(moduleId)) {
        admin.workspacePermissions.push(workspace._id);
      }
    });
  }
  await user.save();
  return await workspace.save();
};

export const getAllCapaworkspaces = async (body: getworkspacesofuserRequest) => {
  const { moduleId, Page, Limit, user, search } = body;
  const page = Page || 1;
  const limit = Limit || 10;
  const skip = (page - 1) * limit;

  const query: IqueryofGetworkspaces = {
    moduleId: new mongoose.Types.ObjectId(moduleId),
    isDeleted: false,
  };
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  console.log('body:', body);

  const [results, totalCountArr] = await Promise.all([
    CapaworkspaceModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'moduleId',
          foreignField: '_id',
          as: 'module',
          pipeline: [{ $match: { userId: user._id } }],
        },
      },
      {
        $unwind: {
          path: '$module',
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          module: 0,
          __v: 0,
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]),
    CapaworkspaceModel.countDocuments(query),
  ]);

  return { results, total: totalCountArr, page };
};

export const getCapaworkspaceById = async (workspaceId: string) => {
  return await CapaworkspaceModel.findOne({ _id: workspaceId, isDeleted: false })
    .populate('moduleId', 'name')
    .populate('createdBy', 'name email');
};

export const updateCapaworkspace = async (workspaceId: string, data: Partial<CreateCapaworkspaceRequest>) => {
  return await CapaworkspaceModel.findOneAndUpdate({ _id: workspaceId, isDeleted: false }, data, { new: true });
};

export const deleteCapaworkspace = async (workspaceId: string) => {
  return await CapaworkspaceModel.findOneAndUpdate(
    { _id: workspaceId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

export const dashboardAnalytics = async (workspaceId: string) => {
  const result = await LibraryModel.aggregate([
    {
      $match: {
        workspace: new mongoose.Types.ObjectId(workspaceId),
        isDeleted: false,
        status: { $in: ['pending', 'completed', 'in-progress'] },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // First, get all library IDs for the workspace
  const libraries = await LibraryModel.find({
    workspace: new mongoose.Types.ObjectId(workspaceId),
    isDeleted: false,
  }).select('_id');

  const libraryIds = libraries.map((lib) => lib._id);

  // Now, aggregate actions by libraryId
  const actionresult = await Action.aggregate([
    {
      $match: {
        library: { $in: libraryIds },
        isDeleted: false,
        status: { $in: ['pending', 'completed', 'in-progress', 'on-hold'] },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const actionAnalytics = { pending: 0, complete: 0, inProgress: 0, onHold: 0, total: 0 };
  actionresult.forEach((item) => {
    if (item._id === 'pending') actionAnalytics.pending = item.count;
    if (item._id === 'completed') actionAnalytics.complete = item.count;
    if (item._id === 'in-progress') actionAnalytics.inProgress = item.count;
    if (item._id === 'on-hold') actionAnalytics.onHold = item.count;
    actionAnalytics.total += item.count;
  });

  const analytics = { pending: 0, complete: 0, inProgress: 0, total: 0 };
  result.forEach((item) => {
    if (item._id === 'pending') analytics.pending = item.count;
    if (item._id === 'completed') analytics.complete = item.count;
    if (item._id === 'in-progress') analytics.inProgress = item.count;
    analytics.total += item.count;
  });

  return {
    libraryAnalytics: analytics,
    actionAnalytics: actionAnalytics,
  };
};

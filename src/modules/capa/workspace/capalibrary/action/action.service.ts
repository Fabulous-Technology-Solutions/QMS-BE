import AccountModel from '../../../../account/account.modal';
import { ActionMatchQuery, CreateActionRequest } from './action.interfaces';
import Action from './action.modal';
import mongoose from 'mongoose';
import { createNotification } from '../../../../notification/notification.services';
import { LibraryModel } from '../capalibrary.modal';


export const createAction = async (data: CreateActionRequest) => {
  const action = new Action(data);
  await action.save();
  if (data.assignedTo && data.assignedTo.length > 0) {
    const library = await LibraryModel.findById(data.library);
    const assignedUsers = await AccountModel.find({
      _id: { $in: data.assignedTo },
    }).populate('user', 'name email _id');

    // Loop through all assigned users
    for (const account of assignedUsers) {
      if (!account.user?._id) continue; // Skip if no linked user
      const notificationParams: any = {
        userId: account.user._id,
        title: 'Task Assigned',
        message: `${data?.user?.name || 'Someone'} assigned you a task in ${library?.name || 'a library'}`,
        type: 'task',
        notificationFor: 'Action',
        forId: action._id,
        sendEmailNotification: true,
        accountId: account._id,
        subId: account.accountId,
        link: `/capa/${data.moduleId}/workspace/${data.workspaceId}/my-tasks`,
      };

      createNotification(notificationParams, data.workspaceId as string, 'taskassign');
    }
    
    // Note: Deadline reminders are automatically sent by the cron job 
    // (nodeCrone.ts) for actions with upcoming deadlines within 24 hours
  }

  return action;
};

export const getActionById = async (actionId: string, userId: string | undefined) => {
  const match: ActionMatchQuery = { _id: new mongoose.Types.ObjectId(actionId), isDeleted: false };
  if (userId) {
    match.assignedTo = { $in: [new mongoose.Types.ObjectId(userId)] };
  }

  const result = await Action.aggregate([
    { $match: match },
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
        from: 'accounts',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
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
    {
      $lookup: {
        from: 'libraries',
        localField: 'library',
        foreignField: '_id',
        as: 'library',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: '$library', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        library: { name: 1, description: 1, _id: 1 },
        _id: 1,
        name: 1,
        description: 1,
        priority: 1,
        type: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        docfile: 1,
        docfileKey: 1,
      },
    },
  ]);

  const action = result[0];
  if (!action) {
    throw new Error('Action not found');
  }
  return action;
};

export const updateAction = async (actionId: string, data: Partial<CreateActionRequest>) => {
  // Fetch the previous action to get current assignedTo list
  const previousAction = await Action.findById(actionId);
  if (!previousAction) {
    throw new Error('Action not found');
  }

  // Update the action
  const updatedAction = await Action.findOneAndUpdate({ _id: actionId, isDeleted: false }, data, { new: true });
  if (!updatedAction) {
    throw new Error('Action not found');
  }
  const findLibrary = await LibraryModel.findById(previousAction.library);

  // Handle notifications for newly assigned users
  if (data.assignedTo && data.assignedTo.length > 0) {
    const previousAssignedIds = previousAction.assignedTo?.map((id: any) => id.toString()) || [];
    const newAssignedIds = data.assignedTo.map((id: any) => id.toString());

    // Find newly assigned users (in new list but not in previous list)
    const newlyAssignedIds = newAssignedIds.filter((id: string) => !previousAssignedIds.includes(id));

    if (newlyAssignedIds.length > 0) {
      const assignedAccounts = await AccountModel.find({
        _id: { $in: newlyAssignedIds },
      }).populate('user', 'name email _id');

      // Send notifications to newly assigned users
      for (const account of assignedAccounts) {
        if (!account.user?._id) continue;
        const notificationParams: any = {
          userId: account.user._id,
          title: 'Task Assigned',
          message: `${data?.user?.name || 'Someone'} assigned you a task in ${findLibrary?.name || 'a library'}`,
          type: 'task',
          notificationFor: 'Action',
          forId: updatedAction._id,
          sendEmailNotification: true,
          accountId: account._id,
          subId: account.accountId,
          link: `/capa/${data.moduleId}/workspace/${data.workspaceId}/my-tasks`,
        };

        createNotification(notificationParams, data.workspaceId as string, 'taskassign');
      }
    }

    // Find removed users (in previous list but not in new list)
    const removedAssignedIds = previousAssignedIds.filter((id: string) => !newAssignedIds.includes(id));
    console.log('Removed Assigned IDs:', removedAssignedIds);

    if (removedAssignedIds.length > 0) {
      const removedAccounts = await AccountModel.find({
        _id: { $in: removedAssignedIds },
      }).populate('user', 'name email _id');

      // Send notifications to removed users
      for (const account of removedAccounts) {
        if (!account.user?._id) continue;
        const notificationParams: any = {
          userId: account.user._id,
          title: 'Task Unassigned',
          message: `${data?.user?.name || 'Someone'} removed you from a task in ${findLibrary?.name || 'a library'}`,
          type: 'task',
          notificationFor: 'Action',
          forId: updatedAction._id,
          sendEmailNotification: true,
          accountId: account._id,
          subId: account.accountId,
        };

        createNotification(notificationParams, data.workspaceId as string, 'taskassign');
      }
    }
  }

  // Handle notification when status is changed to 'completed'
  if (data.status && data.status === 'completed' && previousAction.status !== 'completed') {
    if (updatedAction.assignedTo && updatedAction.assignedTo.length > 0) {
      const assignedAccounts = await AccountModel.find({
        _id: { $in: updatedAction.assignedTo },
      }).populate('user', 'name email _id');

      // Send notifications to all assigned users about task completion
      for (const account of assignedAccounts) {
        if (!account.user?._id) continue;
        const notificationParams: any = {
          userId: account.user._id,
          title: 'Task Completed',
          message: `${data?.user?.name || 'Someone'} marked the task as completed in ${findLibrary?.name || 'a library'}`,
          type: 'task',
          notificationFor: 'Action',
          forId: updatedAction._id,
          sendEmailNotification: true,
          accountId: account._id,
          subId: account.accountId,
          link: `/capa/${data.moduleId}/workspace/${data.workspaceId}/my-tasks`,
        };

        createNotification(notificationParams, data.workspaceId as string, 'taskcompleted');
      }
    }
  }

  return updatedAction;
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
        pipeline: [{ $match: { isDeleted: false } }],
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

export const getActionsByLibrary = async (libraryId: string, page: number = 1, limit: number = 10, search: string = '') => {
  const matchStage: any = { library: new mongoose.Types.ObjectId(libraryId), isDeleted: false };

  const searchStages = search
    ? [
        {
          $match: {
            $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
          },
        },
      ]
    : [];

  const result = await Action.aggregate([
    { $match: matchStage },
    ...searchStages,
    {
      $lookup: {
        from: 'libraries',
        localField: 'library',
        foreignField: '_id',
        as: 'library',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: '$library' },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'accounts',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
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
    {
      $lookup: {
        from: 'causes',
        localField: 'cause',
        foreignField: '_id',
        as: 'cause',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        priority: 1,
        type: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        cause: { name: 1, description: 1, _id: 1 },
        createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        library: { name: 1, description: 1, _id: 1 },
        docfile: 1,
        docfileKey: 1,
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
        stats: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              counts: { $push: { status: '$_id', count: '$count' } },
              total: { $sum: '$count' },
            },
          },
          {
            $addFields: {
              counts: {
                $map: {
                  input: ['pending', 'in-progress', 'completed', 'on-hold'],
                  as: 'status',
                  in: {
                    status: '$$status',
                    count: {
                      $let: {
                        vars: {
                          found: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: '$counts',
                                  as: 'c',
                                  cond: { $eq: ['$$c.status', '$$status'] },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: { $ifNull: ['$$found.count', 0] },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $addFields: {
              completed: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$counts',
                      as: 'c',
                      cond: { $eq: ['$$c.status', 'completed'] },
                    },
                  },
                  0,
                ],
              },
            },
          },
          {
            $addFields: {
              percentageCompleted: {
                $cond: [
                  { $eq: ['$total', 0] },
                  0,
                  {
                    $multiply: [
                      {
                        $divide: [{ $ifNull: ['$completed.count', 0] }, '$total'],
                      },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ]);

  const actions = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;

  // Ensure stats object exists
  const stats = result[0]?.stats[0] || {
    counts: [
      { status: 'pending', count: 0 },
      { status: 'in-progress', count: 0 },
      { status: 'completed', count: 0 },
      { status: 'on-hold', count: 0 },
    ],
    total: 0,
    percentageCompleted: 0,
  };

  return { actions, totalCount, stats, page, limit };
};

export const deleteAction = async (actionId: string, userId: string | undefined) => {
  const action = await Action.findOneAndUpdate(
    { _id: actionId, isDeleted: false, ...(userId ? { assignedTo: userId } : {}) },
    { isDeleted: true },
    { new: true }
  );
  if (!action) {
    throw new Error('Action not found');
  }
  return action;
};

export const getActionsByAssignedTo = async (userId: string, page: number = 1, limit: number = 10, search: string = '') => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const matchStage = {
    assignedTo: { $in: [userObjectId] },
    isDeleted: false,
  };

  const searchStages = search
    ? [
        {
          $match: {
            $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
          },
        },
      ]
    : [];

  const result = await Action.aggregate([
    { $match: matchStage },
    ...searchStages,
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'libraries',
        let: {
          libraryId: '$library',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$_id', '$$libraryId'] }, { $eq: ['$isDeleted', false] }],
              },
            },
          },
        ],
        as: 'library',
      },
    },
    { $unwind: { path: '$library' } },
    {
      $lookup: {
        from: 'accounts',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
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
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        priority: 1,
        type: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        library: { name: 1, description: 1, _id: 1 },
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const actions = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  return {
    data: actions,
    total,
    page,
    limit,
  };
};

export const getActionsByWorkspace = async (
  workspaceId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  const matchStage = { isDeleted: false, endDate: { $lt: new Date() }, status: { $ne: 'completed' } };
  const searchStages = search
    ? [
        {
          $match: {
            $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
          },
        },
      ]
    : [];

  const result = await Action.aggregate([
    { $match: matchStage },
    ...searchStages,
    {
      $lookup: {
        from: 'libraries',
        localField: 'library',
        foreignField: '_id',
        as: 'library',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: '$library' },
    {
      $match: { 'library.workspace': new mongoose.Types.ObjectId(workspaceId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'accounts',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
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
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        priority: 1,
        type: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        createdBy: { name: 1, email: 1, profilePicture: 1 },
        assignedTo: { name: 1, email: 1, profilePicture: 1 },
        library: { name: 1, description: 1, _id: 1 },
      },
    },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const actions = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;

  return { data: actions, total: totalCount, page, limit, message: 'Actions retrieved successfully', success: true };
};

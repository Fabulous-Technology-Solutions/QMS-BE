import { ActionMatchQuery, CreateActionRequest } from './action.interfaces';
import Action from './action.modal';
import mongoose from 'mongoose';

export const createAction = async (data: CreateActionRequest) => {
  const action = new Action(data);
  await action.save();
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
        // pipeline: [{ $match: { isDeleted: false } }]
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
        // pipeline: [{ $match: { isDeleted: false } }]
      },
    },
    {
      $lookup: {
        from: 'risklibraries',
        localField: 'library',
        foreignField: '_id',
        as: 'library',
        // pipeline: [{ $match: { isDeleted: false } }]
      },
    },
    { $unwind: { path: '$library', preserveNullAndEmptyArrays: true } },
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
        cause: 1,
        personnel: 1,
        budget: 1,
        createdBy: { name: 1, email: 1, profilePicture: 1 },
        assignedTo: { name: 1, email: 1, profilePicture: 1 },
        library: { name: 1, description: 1 },
      },
    },
  ]);

  const action = result[0];
  if (!action) {
    throw new Error('Action not found');
  }
  return action;
};

export const updateAction = async (actionId: string, data: Partial<CreateActionRequest>, userId: string | undefined) => {
  const match: ActionMatchQuery = { _id: actionId, isDeleted: false };
  if (userId) {
    match.assignedTo = { $in: [new mongoose.Types.ObjectId(userId)] };
  }

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
        from: 'risklibraries', // replace with your actual library collection name
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
        from: 'risklibraries',
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
      $lookup: {
        from: 'riskcauses',
        localField: 'cause',
        foreignField: '_id',
        as: 'cause',
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
        library: { name: 1, description: 1 ,_id: 1},
        personnel: 1,
        budget: 1,
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
                  input: ['open', 'in-progress','closed'],
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
                      cond: { $eq: ['$$c.status', 'closed'] },
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
      { status: 'open', count: 0 },
      { status: 'in-progress', count: 0 },
      { status: 'closed', count: 0 },
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

export const getActionsByAssignedTo = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const matchStage = {
    assignedTo: { $in: [userObjectId] },
    isDeleted: false,
  };

  const searchStages = search
    ? [
        {
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
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
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'risklibraries',
        let: {
          libraryId: '$library',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$libraryId'] },
                  { $eq: ['$isDeleted', false] }
                ]
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
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedTo',
      },
    },
    {
      $lookup: {
        from: 'riskcauses',
        localField: 'cause',
        foreignField: '_id',
        as: 'cause',
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
        createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
        library: { name: 1, description: 1, _id: 1 },
        cause: { name: 1, description: 1, _id: 1 },
        personnel: 1,
        budget: 1,
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
  const matchStage = { isDeleted: false, endDate: { $lt: new Date() }, status: { $ne: 'closed' } };
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
        from: 'risklibraries',
        localField: 'library',
        foreignField: '_id',
        as: 'library',
      },
    },
    { $unwind: '$library' },
    {
      $match: { 'library.workspace': new mongoose.Types.ObjectId(workspaceId) },
    },
    {
      $lookup: {
        from: 'riskcauses',
        localField: 'cause',
        foreignField: '_id',
        as: 'cause',
        pipeline: [{ $project: { name: 1, description: 1 } }],
      },
    },
    { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
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
        priority: 1,
        type: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        budget: 1,
        personnel: 1,
        cause: { name: 1, description: 1, _id: 1 },
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

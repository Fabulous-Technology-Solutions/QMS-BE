import mongoose from 'mongoose';
import AccountModel from './account.modal';
import { Iaccount } from './account.interfaces';


export const getAllAccounts = async (accountId: string, page: number = 1, limit: number = 10, searchUsername?: string) => {
  const skip = (page - 1) * limit;

  const pipeline: any[] = [
    {
      $match: {
        accountId: new mongoose.Types.ObjectId(accountId),
        role: { $in: ['admin'] },
      },
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'Permissions.workspace',
        foreignField: '_id',
        as: 'workspaceDetails',
        pipeline: [
          {
            $lookup: {
              from: 'subscriptions',
              localField: 'moduleId',
              foreignField: '_id',
              as: 'module',
              pipeline: [
                {
                  $lookup: {
                    from: 'plans',
                    localField: 'planId',
                    foreignField: '_id',
                    as: 'plan',
                    pipeline: [{ $project: { _id: 1, name: 1 } }],
                  },
                },
                { $unwind: '$plan' },
              ],
            },
          },
          { $unwind: '$module' },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
        pipeline: [{ $project: { _id: 1, name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    { $unwind: '$userDetails' },

    // --- Flatten workspaces ---
    { $unwind: '$workspaceDetails' },

    // --- Group by user + plan (module) to keep unique modules ---
    {
      $group: {
        _id: {
          userId: '$userDetails._id',
          planId: '$workspaceDetails.module.plan._id',
        },
        account: { $first: '$$ROOT' },
        user: { $first: '$userDetails' },
        planName: { $first: '$workspaceDetails.module.plan.name' },
      },
    },

    // --- Group again by user to collect modules ---
    {
      $group: {
        _id: '$user._id',
        user: { $first: '$user' },
        account: { $first: '$account' },
        modules: { $addToSet: { name: '$planName' } }, // addToSet ensures unique modules
      },
    },

    {
      $project: {
        _id: 0,
        user: 1,
        modules: 1,
        account: { role: '$account.role', id: '$account._id', status: '$account.status' },
      },
    },

    // Pagination
    { $skip: skip },
    { $limit: limit },
  ];

  // Add search filter if username is provided
  if (searchUsername) {
    pipeline.push({
      $match: {
        $or: [
          { 'userDetails.name': { $regex: searchUsername, $options: 'i' } },
          { 'userDetails.email': { $regex: searchUsername, $options: 'i' } },
        ],
      },
    });
  }

  // Add pagination
  pipeline.push({ $skip: skip }, { $limit: limit });

  const accounts = await AccountModel.aggregate(pipeline);

  // Get total count for pagination info
  const totalPipeline = pipeline.slice(0, -2); // Remove skip and limit
  if (searchUsername) {
    totalPipeline.push({ $count: 'total' });
  } else {
    totalPipeline.push({ $count: 'total' });
  }

  const totalResult = await AccountModel.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  return {
    accounts,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const deleteAccountById = async (accountId: string) => {
  const account = await AccountModel.findByIdAndDelete(accountId);
  return account;
};

export const getAccountById = async (Id: string) => {
  const pipeline = [
    {
      $match: { _id: new mongoose.Types.ObjectId(Id) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { _id: 1, name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    { $unwind: '$user' },
  ];

  const result = await AccountModel.aggregate(pipeline);
  return result[0] || null;
};

export const switchAccount = async (userId: string, accountId: string) => {
  console.log('Switching account for userId:', userId, 'to accountId:', accountId);

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(accountId),
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'Permissions.workspace',
        foreignField: '_id',
        as: 'workspaceDetails',
        pipeline: [
          {
            $lookup: {
              from: 'subscriptions',
              localField: 'moduleId',
              foreignField: '_id',
              as: 'module',
              pipeline: [
                {
                  $lookup: {
                    from: 'plans',
                    localField: 'planId',
                    foreignField: '_id',
                    as: 'plan',
                    pipeline: [{ $project: { _id: 1, name: 1 , description: 1 } }],
                  },
                },
                { $unwind: '$plan' },
              ],
            },
          },
          { $unwind: '$module' },
        ],
      },
    },
    { $unwind: '$workspaceDetails' },
    {
      $group: {
        _id: '$workspaceDetails.module._id',
        planName: { $first: '$workspaceDetails.module.plan.name' },
        description: { $first: '$workspaceDetails.module.plan.description' },
        account: { $first: '$$ROOT' },
      },
    },
    {
      $group: {
        _id: '$_id.user', // or just null if you want single account
        modules: { $addToSet: { _id: '$_id', name: '$planName' , description: '$description' } },
        account: { $first: '$account' },
      },
    },
    {
      $project: {
        _id: 0,
        modules: 1,
      },
    },
  ];

  const result = await AccountModel.aggregate(pipeline);
  const account = result[0] || null;

  if (!account) {
    throw new Error('Account not found or does not belong to the user');
  }

  return account;
};

export const getModuleWorkspaces = async (
  accountId: string, 
  moduleId: string, 
  userId: string, 
  page: number = 1, 
  limit: number = 10, 
  searchWorkspace?: string
) => {
  const skip = (page - 1) * limit;

  const pipeline: any[] = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(accountId),
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'Permissions.workspace',
        foreignField: '_id',
        as: 'workspaceDetails',
        pipeline: [
          {
            $match: {
              'moduleId': new mongoose.Types.ObjectId(moduleId),
            },
          },
        ],
      },
    },
    { $unwind: '$workspaceDetails' },
  ];

  // Add search filter if searchWorkspace is provided
  if (searchWorkspace) {
    pipeline.push({
      $match: {
        'workspaceDetails.name': { $regex: searchWorkspace, $options: 'i' },
      },
    });
  }

  // Add pagination
  pipeline.push(
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        workspace: '$workspaceDetails',
      },
    }
  );

  const workspaces = await AccountModel.aggregate(pipeline);

  // Get total count for pagination info
  const totalPipeline = pipeline.slice(0, -3); // Remove skip, limit, and project
  totalPipeline.push({ $count: 'total' });

  const totalResult = await AccountModel.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  return {
    results: workspaces.map(w => w.workspace),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateAccountById = async (Id: string, updateBody: Iaccount) => {
  const account = await AccountModel.findByIdAndUpdate(Id, updateBody, { new: true });
  return account;
};


export const checkUserBelongsToAccount = async (userId: string, accountId: string, workspaceId: string) => {
  const account = await AccountModel.findOne({ _id: accountId, user: userId, 'Permissions.workspace': workspaceId });
  if(!account){
    throw new Error('Account not found or does not belong to the user');
  }  
  return !!account; // returns true if account exists, false otherwise
};


export const findUserBelongToRiskLibrary = async (userId: string, accountId: string, libraryId: string) => {
  const account = await AccountModel.aggregate([
    {
      $match: {
        _id: accountId,
        user: userId,
      },
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'Permissions.workspace',
        foreignField: '_id',
        as: 'workspaceDetails',
        pipeline: [
          {
            $lookup: {
              from: 'risklibraries',
              localField: '_id',
              foreignField: 'workspace',
              as: 'libraryDetails',
              pipeline: [
                {
                  $match: {
                    _id: new mongoose.Types.ObjectId(libraryId),
                  },
                },
              ],
            },
          },
          { $unwind: '$libraryDetails' },
        ],
      },
    },
    { $unwind: '$workspaceDetails' },
  ]);

  if (!account) {
    throw new Error('Account not found or does not belong to the user');
  }  
  return !!account; // returns true if account exists, false otherwise
}
export const findUserBelongToCapaLibrary = async (userId: string, accountId: string, libraryId: string) => {
  const account = await AccountModel.aggregate([
    {
      $match: {
        _id: accountId,
        user: userId,
      },
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'Permissions.workspace',
        foreignField: '_id',
        as: 'workspaceDetails',
        pipeline: [
          {
            $lookup: {
              from: 'libraries',
              localField: '_id',
              foreignField: 'workspace',
              as: 'libraryDetails',
              pipeline: [
                {
                  $match: {
                    _id: new mongoose.Types.ObjectId(libraryId),
                  },
                },
              ],
            },
          },
          { $unwind: '$libraryDetails' },
        ],
      },
    },
    { $unwind: '$workspaceDetails' },
  ]);

  if (!account) {
    throw new Error('Account not found or does not belong to the user');
  }  
  return !!account; // returns true if account exists, false otherwise
}
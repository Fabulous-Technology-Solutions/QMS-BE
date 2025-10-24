import mongoose, { ObjectId } from 'mongoose';
import {
  AdminBelongtoLibrary,
  CreateLibraryRequest,
  GetLibrariesQuery,
  GetLibrariesQueryforUser,
  SubAdminBelongtoLibrary,
  UpdateContainmentRequest,
  UpdateForm5W2HRequest,
} from './capalibrary.interfaces';
import { LibraryModel } from './capalibrary.modal';
import subAdmin from './../../../user/user.subAdmin';
import {IUserDoc } from '../../../../modules/user/user.interfaces';
import ActivityLog from '../../../../modules/activitylogs/activitylogs.modal';
import { pdfTemplate, pdfTemplateforMutiples } from '../../../../modules/utils/pdfTemplate';
import { uploadSingleFile } from '../../../../modules/upload/upload.middleware';
import { launchBrowser } from '../../../../utils/puppeteer.config';
import CapaworkspaceModel from '../../../../modules/workspace/workspace.modal';
import { createChat } from '../../../../modules/chat/chat.services';
import AccountModel from '../../../../modules/account/account.modal';
import { createNotification } from '../../../../modules/notification/notification.services';
import { ICreateNotificationParams } from '../../../../modules/notification/notification.interfaces';


export const CreateLibrary = async (body: CreateLibraryRequest) => {
  const findWorkspace = await CapaworkspaceModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(body.workspace), isDeleted: false } },
    { $lookup: { from: 'subscriptions', localField: 'moduleId', foreignField: '_id', as: 'module' } },
    { $unwind: '$module' },
    {
      $lookup: {
        from: 'plans',
        localField: 'module.planId',
        foreignField: '_id',
        as: 'plan',
        pipeline: [
          {
            $match: { category: 'capa-management' },
          },
        ],
      },
    },
    { $unwind: '$plan' },
  ]);

  if (!findWorkspace || findWorkspace.length === 0) {
    throw new Error('Workspace not found');
  }

  const library = new LibraryModel(body);
  await createChat({
    obj: library._id,
    chatOf: 'Library',
  });

  const savedLibrary = await library.save();

  // Send notifications to managers when library is created
  try {
    if (body.managers && body.managers.length > 0) {
      const managerAccounts = await AccountModel.find({
        _id: { $in: body.managers },
      }).populate('user', 'name email _id');

      // Send notification to each manager
      for (const account of managerAccounts) {
        if (!account.user?._id) continue;

        const notificationParams: ICreateNotificationParams = {
          userId: account.user._id?.toString() || '',
          title: 'New Library Created',
          message: `A new library "${library.name}" has been created and you have been assigned as a manager.`,
          type: 'library' as any,
          notificationFor: 'Library',
          forId: savedLibrary._id?.toString(),
          sendEmailNotification: true,
          accountId: account._id?.toString() || '',
          subId: account.accountId?.toString() || '',
          link: `/capa/${body?.moduleId}/workspace/${body.workspace}/library`,
        };
        try {
          createNotification(notificationParams, body.workspace as string, 'newprojectassigned');
        } catch (notificationError) {
          console.error(
        
            notificationError
          );
        }
      }
    }
  } catch (error) {
    console.error('❌ Error sending library creation notifications:', error);
    // Don't throw error - library creation should not fail if notification fails
  }

  return savedLibrary;
};

export const getLibraryById = async (libraryId: string) => {
  const data = await LibraryModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(libraryId),
        isDeleted: false,
      },
    },
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
    {
      $lookup: {
        from: 'accounts',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
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
        from: 'accounts',
        localField: 'containment.responsibles',
        foreignField: '_id',
        as: 'containment.responsibles',
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
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'processes',
        localField: 'processdata.process',
        foreignField: '_id',
        as: 'processdata.process',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $unwind: { path: '$processdata.process', preserveNullAndEmptyArrays: true },
    },
  ]);

  if (!data || data.length === 0) {
    throw new Error('Library not found');
  }
  return data[0];
};

export const getLibrariesByWorkspace = async (
  workspaceId: string,
  page: number,
  limit: number,
  search: string,
  isDeleted: boolean
) => {
  const matchStage: GetLibrariesQuery = { workspace: new mongoose.Types.ObjectId(workspaceId), isDeleted };
  if (search) {
    matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'actions',
        localField: '_id',
        foreignField: 'library',
        as: 'tasks',
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $lookup: {
              from: 'accounts',
              localField: 'assignedTo',
              foreignField: '_id',
              as: 'assignedTo',
              pipeline: [
                { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
                { $unwind: { path: '$user' } },
                { $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 } },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'deletedBy',
        foreignField: '_id',
        as: 'deletedBy',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    { $unwind: { path: '$deletedBy', preserveNullAndEmptyArrays: true } },
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
    {
      $lookup: {
        from: 'accounts',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
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
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'processes',
        localField: 'processdata.process',
        foreignField: '_id',
        as: 'processdata.process',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $unwind: { path: '$processdata.process', preserveNullAndEmptyArrays: true },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const data = await LibraryModel.aggregate(pipeline);

  // Get total count for pagination
  const countPipeline = [{ $match: matchStage }, { $count: 'total' }];
  const countResult = await LibraryModel.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  return {
    data,
    total,
    page,
    limit,
    success: true,
    message: 'Libraries retrieved successfully',
  };
};

export const getLibrariesfilterData = async (workspaceId: string, page: number, limit: number, search: string) => {
  const matchStage: GetLibrariesQuery = {
    workspace: new mongoose.Types.ObjectId(workspaceId),
    isDeleted: false,
    status: 'pending',
  };

  const days = 30;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  if (search) {
    matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  }

  const pipeline = [
    { $match: { ...matchStage, updatedAt: { $lte: cutoffDate } } },
    {
      $lookup: {
        from: 'actions',
        localField: '_id',
        foreignField: 'library',
        as: 'tasks',
        pipeline: [
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
        ],
      },
    },
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
    {
      $lookup: {
        from: 'accounts',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
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
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const data = await LibraryModel.aggregate(pipeline);

  // Get total count for pagination
  const countPipeline = [{ $match: { ...matchStage, updatedAt: { $lte: cutoffDate } } }, { $count: 'total' }];
  const countResult = await LibraryModel.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  return {
    data,
    total,
    page,
    limit,
    success: true,
    message: 'Libraries retrieved successfully',
  };
};

export const updateLibrary = async (libraryId: string, updateData: Partial<CreateLibraryRequest>) => {
  if (updateData.status === 'completed') {
    updateData['endDate'] = new Date();
  } else if (updateData.status === 'pending' || updateData.status === 'in-progress') {
    updateData['endDate'] = null;
  }
  // Fetch existing library to detect manager changes
  const existingLibrary = await LibraryModel.findOne({ _id: libraryId, isDeleted: false });
  if (!existingLibrary) {
    throw new Error('Library not found');
  }

  // Detect manager assignments/removals only if managers field is provided in updateData
  let addedManagers: string[] = [];
  let removedManagers: string[] = [];
  if (updateData.managers) {
    const prevManagers = (existingLibrary.managers || []).map((m: ObjectId) => m.toString());
    const newManagers = (updateData.managers || []).map((m: string) => m.toString());

    addedManagers = newManagers.filter((m: string) => !prevManagers.includes(m));
    removedManagers = prevManagers.filter((m: string) => !newManagers.includes(m));
  }

  // Apply update
  const library = await LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, updateData, { new: true });

  if (!library) {
    throw new Error('Library not found');
  }

  // Send notifications for added managers
  try {
    if (addedManagers && addedManagers.length > 0) {
      const accounts = await AccountModel.find({ _id: { $in: addedManagers } }).populate('user', 'name email _id');
      for (const account of accounts) {
        if (!account.user?._id) continue;
        const notificationParams: ICreateNotificationParams = {
          userId: account.user._id?.toString() || '',
          title: 'Assigned as Library Manager',
          message: `You have been assigned as a manager for the library "${library.name}".`,
          type: 'library' as any,
          notificationFor: 'Library',
          forId: library._id?.toString(),
          sendEmailNotification: true,
          accountId: account._id?.toString() || '',
          subId: account.accountId?.toString() || '',
          link: `/capa/${updateData?.moduleId?.toString?.() || ''}/workspace/${(library.workspace as any)?.toString?.() || ''}/library`,
        };
        try {
          createNotification(notificationParams, (library.workspace as any)?.toString?.() || '', 'newprojectassigned');
        } catch (notificationError) {
          console.error(notificationError);
        }
      }
    }

    // Send notifications for removed managers
    if (removedManagers && removedManagers.length > 0) {
      const accounts = await AccountModel.find({ _id: { $in: removedManagers } }).populate('user', 'name email _id');
      for (const account of accounts) {
        if (!account.user?._id) continue;
        const notificationParams: ICreateNotificationParams = {
          userId: account.user._id?.toString() || '',
          title: 'Removed as Library Manager',
          message: `You have been removed as a manager from the library "${library.name}".`,
          type: 'library' as any,
          notificationFor: 'Library',
          forId: library._id?.toString(),
          sendEmailNotification: true,
          accountId: account._id?.toString() || '',
          subId: account.accountId?.toString() || '',
          link: `/capa/${(updateData as any)?.moduleId?.toString?.() || ''}/workspace/${(library.workspace as any)?.toString?.() || ''}/library`,
        };
        try {
          createNotification(notificationParams, (library.workspace as any)?.toString?.() || '', 'newprojectassigned');
        } catch (notificationError) {
          console.error(notificationError);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error sending manager change notifications:', err);
    // Do not fail the update if notifications error out
  }

  // Send notification to managers and members when status changes to 'completed'
  try {
    // Only notify when status changed to completed
    if (library.status === 'completed' && existingLibrary.status !== 'completed') {
      const managerIds = (library.managers || []).map((m: mongoose.Schema.Types.ObjectId) => m.toString());
      const memberIds = (library.members || []).map((m: mongoose.Schema.Types.ObjectId) => m.toString());
      const accountIds = Array.from(new Set([...managerIds, ...memberIds]));

      if (accountIds.length > 0) {
        const accounts = await AccountModel.find({ _id: { $in: accountIds } }).populate('user', 'name email _id');
        for (const account of accounts) {
          if (!account.user?._id) continue;
          const notificationParams: ICreateNotificationParams = {
            userId: account.user._id?.toString() || '',
            title: 'Library Completed',
            message: `The library "${library.name}" has been marked as completed.`,
            type: 'library' as any,
            notificationFor: 'Library',
            forId: library._id?.toString(),
            sendEmailNotification: true,
            accountId: account._id?.toString() || '',
            subId: account.accountId?.toString() || '',
            link: `/capa/${(updateData as any)?.moduleId?.toString?.() || ''}/workspace/${(library.workspace as any)?.toString?.() || ''}/library`,
          };
          try {
            createNotification(notificationParams, (library.workspace as any)?.toString?.() || '', 'projectcompleted');
          } catch (notificationError) {
            console.error('Error sending library completed notification:', notificationError);
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Error sending library completed notifications:', err);
    // Do not fail update on notification errors
  }

  return library;
};

export const deleteLibrary = async (libraryId: string, userId: string) => {
  const library = await LibraryModel.findOneAndUpdate(
    { _id: libraryId, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true }
  );
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
};

export const getLibrariesNames = async (workspaceId: string) => {
  return await LibraryModel.find({ workspace: workspaceId, isDeleted: false }, 'name');
};

export const addMemberToLibrary = async (libraryId: string, members: ObjectId[]) => {
  try {
    const library = await getLibraryById(libraryId);
    if (!library) {
      throw new Error('Library not found');
    }

    const existingMemberIds = library.members.map((m: any) => m.toString());
    const managerIds = library.managers.map((m: any) => m.toString());

    for (const memberId of members) {
      const idStr = memberId.toString();

      // Skip if already a member
      if (existingMemberIds.includes(idStr)) {
        continue; // just skip instead of throwing
      }

      // Skip if a manager
      if (managerIds.includes(idStr)) {
        continue;
      }

      library.members.push(memberId);
    }

    return await LibraryModel.updateOne({ _id: library._id }, { members: library.members }, { new: true });
  } catch (error) {
    console.error('Error adding members to library:', error);
    throw new Error('Failed to add members to library');
  }
};

export const removeMemberFromLibrary = async (libraryId: string, memberId: string) => {
  // Ensure the library exists before removing a member
  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new Error('Library not found');
  }
  if (
    !library.members.some(
      (member: Record<string, any>) => member && member['_id'] && member['_id'].toString() === memberId.toString()
    )
  ) {
    throw new Error('Member is not in the library');
  }

  library.members = library.members?.filter((member: any) => member['_id'].toString() !== memberId.toString());
  const findandUpdate = await LibraryModel.findOneAndUpdate({ _id: libraryId }, { members: library.members }, { new: true });

  console.log('Member removed from library:', memberId, library);
  return findandUpdate;
};

export const getLibraryMembers = async (libraryId: string, page = 1, limit = 10, search = '') => {
  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(libraryId);
  } catch (err) {
    throw new Error('Invalid libraryId');
  }
  const matchStage = {
    _id: objectId,
    // isDeleted: false,
  };

  const memberMatch: any = {};
  if (search) {
    memberMatch['user.name'] = { $regex: search, $options: 'i' };
  }

  const pipeline = [
    { $match: matchStage },
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
          ...(search ? [{ $match: memberMatch }] : []),
          {
            $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
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
    { $unwind: '$members' },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const result = await LibraryModel.aggregate(pipeline);

  // Optionally, get total count for pagination
  const countPipeline = [
    { $match: matchStage },
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
          ...(search ? [{ $match: memberMatch }] : []),
        ],
      },
    },
    { $unwind: '$members' },
    { $count: 'total' },
  ];
  const countResult = await LibraryModel.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  return {
    data: result.map((r) => r.members),
    total,
    page,
    limit,
    success: true,
    message: 'Library member(s) retrieved successfully',
  };
};

export const checkAdminBelongsTtoLibrary = async (libraryId: string, userId: ObjectId) => {
  const Querydata: AdminBelongtoLibrary = {
    _id: new mongoose.Types.ObjectId(libraryId),
    isDeleted: false,
  };
  // if (dataType === 'mydocuments') {
  //   Querydata['managers'] = { $in: [userId] };
  // }

  const library = await LibraryModel.aggregate([
    { $match: Querydata },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'workspace',
        foreignField: '_id',
        as: 'workspace',
      },
    },
    { $unwind: '$workspace' },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'workspace.moduleId',
        foreignField: '_id',
        as: 'module',
      },
    },
    { $unwind: '$module' },
    {
      $lookup: {
        from: 'plans',
        localField: 'module.planId',
        foreignField: '_id',
        as: 'plan',
        pipeline: [
          {
            $match: { category: 'capa-management' },
          },
        ],
      },
    },
    {
      $unwind: '$plan',
    },
    {
      $match: {
        'module.userId': userId,
      },
    },
  ]);
  console.log('Admin belongs to library:', library, Querydata);
  if (!library || library.length === 0) {
    throw new Error('Library not found');
  }

  return true;
};
export const checkSubAdminBelongsToLibrary = async (
  libraryId: string,
  userId: mongoose.Types.ObjectId,
  dataType?: string
) => {
  const Querydata: SubAdminBelongtoLibrary = {
    'libraries._id': new mongoose.Types.ObjectId(libraryId),
    'libraries.isDeleted': false,
  };

  if (dataType === 'mydocuments') {
    Querydata['libraries.managers'] = { $in: [userId] };
  }

  const library = await subAdmin.aggregate([
    { $match: { _id: userId, isDeleted: false } },
    {
      $lookup: {
        from: 'workspaces',
        let: { workspaceIds: '$adminOF.workspacePermissions' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  '$_id',
                  {
                    $reduce: {
                      input: '$$workspaceIds',
                      initialValue: [],
                      in: { $concatArrays: ['$$value', '$$this'] },
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              name: 1,
              description: 1,
            },
          },
        ],
        as: 'workspace',
      },
    },
    { $unwind: '$workspace' },
    {
      $lookup: {
        from: 'modules',
        localField: 'workspace.moduleId',
        foreignField: '_id',
        as: 'module',
      },
    },
    {
      $unwind: '$module',
    },
    {
      $lookup: {
        from: 'plans',
        localField: 'module.planId',
        foreignField: '_id',
        as: 'plan',
        pipeline: [
          {
            $match: { category: 'capa-management' },
          },
        ],
      },
    },
    {
      $unwind: '$plan',
    },
    {
      $lookup: {
        from: 'libraries',
        localField: 'workspace._id',
        foreignField: 'workspace',
        as: 'libraries',
      },
    },
    { $unwind: '$libraries' },
    {
      $match: Querydata,
    },
  ]);
  if (!library || library.length === 0) {
    throw new Error('Library not found');
  }
  return true;
};

export const checkUserBelongsToLibrary = async (libraryId: string, user: IUserDoc, dataType: string) => {
  const Querydata: any = {
    _id: new mongoose.Types.ObjectId(libraryId),
    isDeleted: false,
  };
  console.log('Query data for user library check:', libraryId, 'User ID:', user?._id);

  if (dataType === 'mydocuments') {
    Querydata['managers'] = { $in: [user?._id] };
  }

  console.log('Query data for user library check:', Querydata, 'User ID:', dataType);

  const result = await LibraryModel.aggregate([
    {
      $match: Querydata,
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'workspace',
        foreignField: '_id',
        as: 'workspace',
      },
    },
    { $unwind: '$workspace' },
    {
      $match: {
        'workspace._id': user.workspace,
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'workspace.moduleId',
        foreignField: '_id',
        as: 'module',
      },
    },
    { $unwind: '$module' },
    {
      $lookup: {
        from: 'plans',
        localField: 'module.planId',
        foreignField: '_id',
        as: 'plan',
        pipeline: [
          {
            $match: { category: 'capa-management' },
          },
        ],
      },
    },
    {
      $unwind: '$plan',
    },
  ]);
  if (!result || result.length === 0) {
    throw new Error('User does not belong to this library');
  }
  return true;
};

export const updateForm5W2H = async (libraryId: string, formData: UpdateForm5W2HRequest) => {
  const library = await LibraryModel.findOneAndUpdate(
    { _id: libraryId, isDeleted: false },
    { Form5W2H: formData },
    { new: true }
  );
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
};

export const updateContainment = async (libraryId: string, containmentData: UpdateContainmentRequest) => {
  const library = await LibraryModel.findOneAndUpdate(
    { _id: libraryId, isDeleted: false },
    { containment: containmentData },
    { new: true }
  );
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
};

export const getLibrariesByManager = async (
  workspaceId: string,
  managerId: string,
  page: number,
  limit: number,
  search: string
) => {
  const matchStage: GetLibrariesQueryforUser = {
    workspace: new mongoose.Types.ObjectId(workspaceId),
    managers: { $in: [new mongoose.Types.ObjectId(managerId)] },
    isDeleted: false,
  };

  if (search) {
    matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'actions',
        localField: '_id',
        foreignField: 'library',
        as: 'tasks',
        pipeline: [
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
        ],
      },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [
          {
            $lookup: {
              from: 'members',
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
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'processes',
        localField: 'processdata.process',
        foreignField: '_id',
        as: 'processdata.process',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $unwind: { path: '$processdata.process', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
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
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const data = await LibraryModel.aggregate(pipeline);

  // Get total count for pagination
  const countPipeline = [{ $match: matchStage }, { $count: 'total' }];
  const countResult = await LibraryModel.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  return {
    data,
    total,
    page,
    limit,
    success: true,
    message: 'Libraries retrieved successfully',
  };
};

export const restoreLibrary = async (libraryIds: string[], workspaceId: string, userId: string) => {
  console.log('Permanently deleting libraries with IDs:', libraryIds);
  const result = await LibraryModel.updateMany({ _id: { $in: libraryIds } }, { isDeleted: false });
  if (result.modifiedCount === 0) {
    throw new Error('No libraries were restored');
  }
  await Promise.all(
    libraryIds.map((id) =>
      ActivityLog.create({
        action: 'restore',
        collectionName: 'Library',
        documentId: id,
        changes: { isDeleted: false },
        performedBy: userId, // You can set this to the user ID if available
        logof: workspaceId, // Set this if you have a workspace or context to log against
        message: 'Library restored',
      })
    )
  );
  return result;
};
export const deletePermanent = async (libraryIds: string[], workspaceId: string, userId: string) => {
  console.log('Permanently deleting libraries with IDs:', libraryIds);
  const result = await LibraryModel.deleteMany({ _id: { $in: libraryIds } });
  if (result.deletedCount === 0) {
    throw new Error('No libraries were deleted');
  }
  await Promise.all(
    libraryIds.map((id) =>
      ActivityLog.create({
        action: 'delete',
        collectionName: 'Library',
        documentId: id,
        changes: { isDeleted: true },
        performedBy: userId, // You can set this to the user ID if available
        logof: workspaceId, // Set this if you have a workspace or context to log against
        message: 'Library permanently deleted',
      })
    )
  );
  return result;
};

export const generateReport = async (libraryId: string) => {
  let browser;
  let page;

  try {
    // 1. Launch headless browser
    browser = await launchBrowser();

    page = await browser?.newPage();
    const [findLibrary] = await LibraryModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(libraryId) } },
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
      {
        $lookup: {
          from: 'accounts',
          localField: 'managers',
          foreignField: '_id',
          as: 'managers',
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
          localField: '_id',
          foreignField: 'library',
          as: 'causes',
          pipeline: [{ $project: { name: 1, description: 1, createdAt: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'actions',
          localField: '_id',
          foreignField: 'library',
          as: 'actions',
          pipeline: [
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
                name: 1,
                email: 1,
                profilePicture: 1,
                status: 1,
                createdAt: 1,
                priority: 1,
                endDate: 1,
                startDate: 1,
                type: 1,
                assignedTo: 1,
                cause: 1,
                docfile: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          pendingActions: {
            $size: {
              $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'pending'] } } }, []],
            },
          },
          inProgressActions: {
            $size: {
              $ifNull: [
                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'in-progress'] } } },
                [],
              ],
            },
          },
          onHoldActions: {
            $size: {
              $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'on-hold'] } } }, []],
            },
          },
          completedActions: {
            $size: {
              $ifNull: [
                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'completed'] } } },
                [],
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'checklisthistories',
          localField: '_id',
          foreignField: 'library',
          as: 'checklisthistory',
          pipeline: [
            {
              $lookup: {
                from: 'checklists', // collection name for Checklist
                localField: 'checklistId',
                foreignField: '_id',
                as: 'checklistId',
                pipeline: [
                  { $project: { name: 1, description: 1 } }, // project what you need
                ],
              },
            },
            {
              $unwind: {
                path: '$checklistId',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: '$list',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'checklistitems', // collection name for CheckListItem
                localField: 'list.item',
                foreignField: '_id',
                as: 'list.itemDetails',
                pipeline: [
                  { $project: { question: 1 } }, // project what you need
                ],
              },
            },
            {
              $unwind: {
                path: '$list.itemDetails',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$_id',
                checklist: { $first: '$checklistId' },
                library: { $first: '$library' },
                comment: { $first: '$comment' },
                createdBy: { $first: '$createdBy' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
                list: {
                  $push: {
                    item: '$list.itemDetails', // populated item
                    yes: '$list.yes',
                    no: '$list.no',
                    partial: '$list.partial',
                    evidence: '$list.evidence',
                    evidenceKey: '$list.evidenceKey',
                    comment: '$list.comment',
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    // if (!findLibrary) {
    //   throw new Error('Library not found');
    // };
    const pdfContent = await pdfTemplate(findLibrary);
    await page.setContent(pdfContent, {
      waitUntil: 'networkidle0',
      timeout: 120000,
    });

    const pdfBuffer = await page?.pdf({
      format: 'a4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm' },
      timeout: 120000, // 2 minutes timeout for PDF generation
    });
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-Report.pdf`;

    // Convert Uint8Array to Buffer
    const buffer = Buffer.from(new Uint8Array(pdfBuffer || []));
    const response = await uploadSingleFile(uniqueFileName, buffer, 'application/pdf', false);

    if (!response) {
      throw new Error('Failed to upload PDF');
    }
    return response;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  } finally {
    // Ensure browser is always closed
    if (page) {
      try {
        await page.close();
        console.log('Page closed');
      } catch (err) {
        console.warn('Error closing page:', err);
      }
    }
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed');
      } catch (err) {
        console.warn('Error closing browser:', err);
      }
    }
  }
};

export const generateFilterReport = async (
  workspaceId: string,
  sites?: string[],
  processes?: string[],
  statuses?: string[]
) => {
  let browser;
  let page;

  try {
    // 1. Launch headless browser
    console.log('Generating filtered report with:', { workspaceId, sites, processes, statuses });

    const query = {
      workspace: new mongoose.Types.ObjectId(workspaceId),
      ...(sites && { site: { $in: sites.map((site) => new mongoose.Types.ObjectId(site)) } }),
      ...(processes && { 'processdata.process': { $in: processes.map((process) => new mongoose.Types.ObjectId(process)) } }),
      ...(statuses && { status: { $in: statuses } }),
    };

    console.log('Aggregation query:', query);
    const findLibraries = await LibraryModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'accounts',
          localField: 'members',
          foreignField: '_id',
          as: 'assignedTo',
          pipeline: [
            {
              $lookup: {
                from: 'members',
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
          from: 'accounts',
          localField: 'managers',
          foreignField: '_id',
          as: 'managers',
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
          localField: '_id',
          foreignField: 'library',
          as: 'causes',
          pipeline: [{ $project: { name: 1, description: 1, createdAt: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'actions',
          localField: '_id',
          foreignField: 'library',
          as: 'actions',
          pipeline: [
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
                name: 1,
                email: 1,
                profilePicture: 1,
                status: 1,
                createdAt: 1,
                priority: 1,
                endDate: 1,
                startDate: 1,
                type: 1,
                assignedTo: 1,
                cause: 1,
                docfile: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          pendingActions: {
            $size: {
              $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'pending'] } } }, []],
            },
          },
          inProgressActions: {
            $size: {
              $ifNull: [
                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'in-progress'] } } },
                [],
              ],
            },
          },
          onHoldActions: {
            $size: {
              $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'on-hold'] } } }, []],
            },
          },
          completedActions: {
            $size: {
              $ifNull: [
                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'completed'] } } },
                [],
              ],
            },
          },
        },
      },
    ]);

    console.log(findLibraries, 'Filtered libraries for report:');

    if (findLibraries.length === 0) {
      console.log('No libraries found for report');
      return null;
    }
    browser = await launchBrowser();
    page = await browser?.newPage();
    const pdfContent = await pdfTemplateforMutiples(findLibraries);
    console.log('PDF content generated', pdfContent);
    await page.setContent(pdfContent, {
      waitUntil: 'networkidle0',
      timeout: 120000,
    });

    const pdfBuffer = await page?.pdf({
      format: 'a4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm' },
      timeout: 120000, // 2 minutes timeout for PDF generation
    });
    console.log('PDF buffer generated', pdfBuffer);
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-Report.pdf`;

    // Convert Uint8Array to Buffer
    const buffer = Buffer.from(new Uint8Array(pdfBuffer || []));
    const response = await uploadSingleFile(uniqueFileName, buffer, 'application/pdf', false);

    if (!response) {
      throw new Error('Failed to upload PDF');
    }
    return response;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  } finally {
    // Ensure browser is always closed
    if (page) {
      try {
        await page.close();
        console.log('Page closed');
      } catch (err) {
        console.warn('Error closing page:', err);
      }
    }
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed');
      } catch (err) {
        console.warn('Error closing browser:', err);
      }
    }
  }
};

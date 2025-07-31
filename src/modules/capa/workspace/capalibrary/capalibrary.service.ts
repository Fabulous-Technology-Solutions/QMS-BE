import mongoose, { ObjectId } from 'mongoose';
import {
  AdminBelongtoLibrary,
  CreateLibraryRequest,
  GetLibrariesQuery,
  GetLibrariesQueryforUser,
  SubAdminBelongtoLibrary,
  UpdateForm5W2HRequest,
} from './capalibrary.interfaces';
import { LibraryModel } from './capalibrary.modal';
import subAdmin from './../../../user/user.subAdmin';
import { IUserDoc } from '@/modules/user/user.interfaces';

export const CreateLibrary = async (body: CreateLibraryRequest) => {
  const library = new LibraryModel(body);
  return await library.save();
};

export const getLibraryById = async (libraryId: string) => {
  const data = await LibraryModel.findOne({ _id: libraryId, isDeleted: false })
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture');

  if (!data) {
    throw new Error('Library not found');
  }
  return data;
};

export const getLibrariesByWorkspace = async (workspaceId: string, page: number, limit: number, search: string) => {
  const matchStage: GetLibrariesQuery = { workspace: new mongoose.Types.ObjectId(workspaceId), isDeleted: false };

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
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
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

export const updateLibrary = async (libraryId: string, updateData: Partial<CreateLibraryRequest>) => {
  const library = await LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, updateData, { new: true })
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture');
  if (!library) {
    throw new Error('Library not found');
  }
};

export const deleteLibrary = async (libraryId: string) => {
  const library = await LibraryModel.findOneAndUpdate(
    { _id: libraryId, isDeleted: false },
    { isDeleted: true },
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

    return await library.save();
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

  library.members = library.members.filter((member: any) => member['_id'].toString() !== memberId.toString());

  console.log('Member removed from library:', memberId, library);
  return await library.save();
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

  const memberMatch: { name: Record<string, string | RegExp> } = { name: {} };
  if (search) {
    memberMatch['name'] = { $regex: search, $options: 'i' };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [
          ...(search ? [{ $match: memberMatch }] : []),
          { $project: { name: 1, email: 1, profilePicture: 1, role: 1, status: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1, status: 1 } }],
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
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [...(search ? [{ $match: memberMatch }] : [])],
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

export const checkAdminBelongsTtoLibrary = async (libraryId: string, userId: ObjectId, dataType?: string) => {
  const Querydata: AdminBelongtoLibrary = {
    _id: new mongoose.Types.ObjectId(libraryId),
    isDeleted: false,
  };
  if (dataType === 'mydocuments') {
    Querydata['managers'] = { $in: [userId] };
  }

  const library = await LibraryModel.aggregate([
    { $match: Querydata },
    {
      $lookup: {
        from: 'capaworkspaces',
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
      $match: {
        'module.userId': userId,
      },
    },
  ]);
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
        from: 'capaworkspaces',
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

  if (dataType === 'mydocuments') {
    Querydata['manager'] = { $in: [user?._id] };
  }

  const result = await LibraryModel.aggregate([
    {
      $match: Querydata,
    },
    {
      $lookup: {
        from: 'capaworkspaces',
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

export const getLibrariesByManager = async (managerId: string, page: number, limit: number, search: string) => {
  const matchStage: GetLibrariesQueryforUser = {
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
              from: 'users',
              localField: 'assignedTo',
              foreignField: '_id',
              as: 'assignedTo',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'members',
        foreignField: '_id',
        as: 'members',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
        pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
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

import mongoose, { ObjectId } from 'mongoose';
import {
  AdminBelongtoLibrary,
  CreateLibraryRequest,
  GetLibrariesQuery,
  GetLibrariesQueryforUser,
  SubAdminBelongtoLibrary,
  

} from './risklibrary.interfaces';
import { LibraryModel } from './risklibrary.modal';
import subAdmin from '../../../user/user.subAdmin';
import { IUserDoc } from '@/modules/user/user.interfaces';
import ActivityLog from '../../../activitylogs/activitylogs.modal';
import { pdfTemplate, pdfTemplateforMutiples } from '../../../utils/pdfTemplate';
import { uploadSingleFile } from '../../../upload/upload.middleware';
import { launchBrowser } from '../../../../utils/puppeteer.config';

export const CreateLibrary = async (body: CreateLibraryRequest) => {
  const library = new LibraryModel(body);
  return await library.save();
};

export const getLibraryById = async (libraryId: string) => {
  const data = await LibraryModel.findOne({ _id: libraryId, isDeleted: false })
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture')
    .populate('site', 'name')
    .populate('process', 'name');

  if (!data) {
    throw new Error('Library not found');
  }
  return data;
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
        from: 'riskactions',
        localField: '_id',
        foreignField: 'library',
        as: 'tasks',
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $lookup: {
              from: 'users',
              localField: 'assignedTo',
              foreignField: '_id',
              as: 'assignedTo',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
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
      $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'processes',
        localField: 'process',
        foreignField: '_id',
        as: 'process',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $unwind: { path: '$process', preserveNullAndEmptyArrays: true },
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
        from: 'riskactions',
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
          {
            $lookup: {
              from: 'riskcauses',
              localField: 'cause',
              foreignField: '_id',
              as: 'cause',
              pipeline: [{ $project: { name: 1, description: 1 } }],
            },
          },
          { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } }
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
  const library = await LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, updateData, { new: true })
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture');
  if (!library) {
    throw new Error('Library not found');
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
      $match: {
        'module.userId': userId,
      },
    },
  ]);
  console.log('Admin belongs to library:', library, userId,Querydata);
  if (!library || library.length === 0) {
    throw new Error('Library not found for this admin');
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
        from: 'risklibraries',
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
  ]);
  if (!result || result.length === 0) {
    throw new Error('User does not belong to this library');
  }
  return true;
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
        from: 'riskactions',
        localField: '_id',
        foreignField: 'library',
        as: 'tasks',
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $lookup: {
              from: 'users',
              localField: 'assignedTo',
              foreignField: '_id',
              as: 'assignedTo',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
          },
          { $lookup: {
              from: 'riskcauses',
              localField: 'cause',
              foreignField: '_id',
              as: 'cause',
              pipeline: [{ $project: { name: 1, description: 1 } }],
            },
          },
          { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
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
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'processes',
        localField: 'process',
        foreignField: '_id',
        as: 'process',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $unwind: { path: '$process', preserveNullAndEmptyArrays: true },
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
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'managers',
          foreignField: '_id',
          as: 'managers',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
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
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
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

export const generateFilterReport = async (workspaceId: string, site?: string, process?: string, status?: string) => {
  let browser;
  let page;

  try {
    // 1. Launch headless browser
    console.log('Generating filtered report with:', { workspaceId, site, process, status });

    const query = {
      workspace: new mongoose.Types.ObjectId(workspaceId),
      ...(site && { site: new mongoose.Types.ObjectId(site) }),
      ...(process && { process: new mongoose.Types.ObjectId(process) }),
      ...(status && { status }),
    };

    const findLibraries = await LibraryModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'managers',
          foreignField: '_id',
          as: 'managers',
          pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
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
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
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


export const setriskappetite = async (libraryId: string, riskappetite: string) => {
  const library = await LibraryModel.findOneAndUpdate(
    { _id: libraryId, isDeleted: false },
    { riskappetite: riskappetite },
    { new: true }
  );
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
};
export const setassessmentApproval = async (libraryId: string, assessmentApproval: { status?: 'Reviewed' | 'Approved' | 'Draft'; feedback?: string }) => {
  const library = await LibraryModel.findOneAndUpdate(
    { _id: libraryId, isDeleted: false },
    { assessmentApproval },
    { new: true }
  );
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
};
import mongoose, {ObjectId} from 'mongoose';
import { CreateLibraryRequest, GetLibrariesQuery } from './capalibrary.interfaces';
import { LibraryModel } from './capalibrary.modal';



export const CreateLibrary = async (body: CreateLibraryRequest) => {
  const library = new LibraryModel(body);
  return await library.save();
};

export const getLibraryById = async (libraryId: string) => {
  const data = await LibraryModel.findById(libraryId)
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture');
  if (!data) {
    throw new Error('Library not found');
  }
  return data;
};

export const getLibrariesByWorkspace = async (workspaceId: string, page: number, limit: number, search: string) => {
  const query: GetLibrariesQuery = { workspace: workspaceId, isDeleted: false };

  if (search) {
    query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  }

  const data = await LibraryModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture');

  const total = await LibraryModel.countDocuments(query);

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
  return await LibraryModel.findByIdAndUpdate(libraryId, updateData, { new: true })
    .populate('members', 'name email profilePicture')
    .populate('managers', 'name email profilePicture');
};

export const deleteLibrary = async (libraryId: string) => {
  const library = await LibraryModel.findByIdAndUpdate(libraryId, { isDeleted: true }, { new: true });
  if (!library) {
    throw new Error('Library not found');
  }
  return library;
};

export const getLibrariesNames = async (workspaceId: string) => {
  return await LibraryModel.find({ workspace: workspaceId, isDeleted: false }, 'name');
};

export const addMemberToLibrary = async (libraryId: string, memberId: ObjectId) => {
  // Ensure the library exists before adding a member
  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new Error('Library not found');
  }
  // check if the member is already in the library
  if (library.members.includes(memberId)) {
    throw new Error('Member is already in the library');
  }

  if (library.managers.includes(memberId)) {
    throw new Error('Member is a manager of the library, cannot add as a member');
  }

  library.members.push(memberId);
  return await library.save();
};

export const removeMemberFromLibrary = async (libraryId: string, memberId: string) => {
  // Ensure the library exists before removing a member
  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new Error('Library not found');
  }
  // check if the member is in the library
  if (!library.members.includes(new mongoose.Schema.Types.ObjectId(memberId))) {
    throw new Error('Member is not in the library');
  }

  library.members = library.members.filter((member) => member.toString() !== memberId.toString());
  return await library.save();
};


export const getLibraryMembers = async (
  libraryId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  let objectId: mongoose.Types.ObjectId;
  try {
    objectId = new mongoose.Types.ObjectId(libraryId);
  } catch (err) {
    throw new Error('Invalid libraryId');
  }
  const matchStage: any = {
    _id: objectId,
    isDeleted: false,
  };

  const memberMatch: any = { };
  if (search) {
    memberMatch.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
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
          { $match: memberMatch },
          { $project: { name: 1, email: 1, profilePicture: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'managers',
        foreignField: '_id',
        as: 'managers',
        pipeline: [
          { $project: { name: 1, email: 1, profilePicture: 1 } },
        ],
      },
    },
    { $unwind: '$members' },
    {
      $limit: limit,
      $skip: (page - 1) * limit,
    }
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
        pipeline: [
          { $match: memberMatch },
        ],
      },
    },
    { $unwind: '$members' },
    { $count: 'total' },
  ];
  const countResult = await LibraryModel.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  return {
    data: result.map(r => r.members),
    total,
    page,
    limit,
    success: true,
    message: 'Library member(s) retrieved successfully',
  };
};

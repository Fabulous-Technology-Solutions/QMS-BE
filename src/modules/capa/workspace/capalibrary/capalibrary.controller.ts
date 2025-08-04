import catchAsync from './../../../utils/catchAsync';
import { Request, Response } from 'express';
import {
  CreateLibrary,
  getLibraryById,
  getLibrariesByWorkspace,
  updateLibrary,
  deleteLibrary,
  getLibrariesNames,
  removeMemberFromLibrary,
  getLibraryMembers,
  addMemberToLibrary,
  updateForm5W2H,
  getLibrariesByManager,
  restoreLibrary,
  deletePermanent,
} from './capalibrary.service';

export const createLibrary = catchAsync(async (req: Request, res: Response) => {
  const library = await CreateLibrary({ ...req.body, createdBy: req.user._id });
  res.locals["message"] = "create library"
  res.locals["documentId"] = library._id;
  res.locals["collectionName"] = "Library";
  res.status(201).json({
    success: true,
    message: 'Library created successfully',
    data: library,
  });
});

export const updateLibraryById = catchAsync(async (req: Request, res: Response) => {
  const library = await updateLibrary(req.params['libraryId'] as string, req.body);
  res.locals["message"] = "update library"
  res.locals["documentId"] = library._id;
  res.locals["collectionName"] = "Library";
  res.status(200).json({
    success: true,
    message: 'Library updated successfully',
    data: library,
  });
});

export const getLibrary = catchAsync(async (req: Request, res: Response) => {
  const library = await getLibraryById(req.params['libraryId'] as string);

  res.status(200).json({
    success: true,
    message: 'Library retrieved successfully',
    data: library,
  });
});

export const getLibraries = catchAsync(async (req: Request, res: Response) => {
  console.log('Fetching libraries for workspace:', req.params['workspaceId']);
  const { workspaceId } = req.params;
  const { page = 1, limit = 10, search = '', isDeleted = false } = req.query;

  const libraries = await getLibrariesByWorkspace(workspaceId || '', Number(page), Number(limit), search as string, Boolean(isDeleted) as boolean);
  console.log('Libraries retrieved:', libraries);

  res.status(200).json(libraries);
});

export const deleteLibraryById = catchAsync(async (req: Request, res: Response) => {
  const library = await deleteLibrary(req.params['libraryId'] as string, req.user._id);
  res.locals["message"] = "delete library"
  res.locals["documentId"] = library._id;
  res.locals["collectionName"] = "Library";
  res.locals["changes"] = { isDeleted: true };
  return res.status(201).json({
    success: true,
    message: 'Library deleted successfully',
    data: library,
  });
});

export const getLibraryNamesController = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params['workspaceId'] || '';
  const libraryNames = await getLibrariesNames(workspaceId);
  res.status(200).json({
    success: true,
    data: libraryNames,
    message: 'Library names retrieved successfully',
  });
});

export const removeMemberFromLibraryController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId, memberId } = req.params;
  res.locals["message"] = "remove member from library"
  res.locals["documentId"] = libraryId;
  res.locals["collectionName"] = "Library";
  const updatedLibrary = await removeMemberFromLibrary(libraryId || '', memberId || '');
  res.status(200).json({
    success: true,
    data: updatedLibrary,
    message: 'Member removed from library successfully',
  });
});

export const getLibraryMembersController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const { page = 1, limit = 10, search = '' } = req.query;

  const members = await getLibraryMembers(libraryId || '', Number(page), Number(limit), search as string);

  res.status(200).json({
    success: true,
    data: members,
    message: 'Library members retrieved successfully',
  });
});

export const addMemberToLibraryController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const { members } = req.body;

  const updatedLibrary = await addMemberToLibrary(libraryId || '', members);
  res.locals["message"] = "add member to library"
  res.locals["documentId"] = libraryId;
  res.locals["collectionName"] = "Library";
  res.locals["changes"] = { members: updatedLibrary.members };

  res.status(200).json({
    success: true,
    data: updatedLibrary,
    message: 'Member added to library successfully',
  });
});

export const updateForm5W2HController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const { form5W2H } = req.body;

  if (!form5W2H) {
    return res.status(400).json({
      success: false,
      message: 'Form5W2H data is required',
    });
  }

  const updatedLibrary = await updateForm5W2H(libraryId || '', form5W2H);
  res.locals["message"] = "update Form5W2H"
  res.locals["documentId"] = libraryId;
  res.locals["collectionName"] = "Library";
  res.locals["changes"] = { Form5W2H: updatedLibrary.Form5W2H };

  return res.status(200).json({
    success: true,
    data: updatedLibrary,
    message: 'Form5W2H updated successfully',
  });
});

export const getLibrariesForUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id as string;
  const { page = 1, limit = 10, search = '' } = req.query;

  const libraries = await getLibrariesByManager(userId || '', Number(page), Number(limit), search as string);
  res.status(200).json(libraries);
});

export const RestoreLibrary = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const restoredLibrary = await restoreLibrary(libraryId || '');
  res.locals["message"] = "restore library"
  res.locals["documentId"] = restoredLibrary._id;
  res.locals["collectionName"] = "Library";
  res.locals["changes"] = { isDeleted: false };
  res.status(200).json({
    success: true,
    data: restoredLibrary,
    message: 'Library restored successfully',
  });
});

export const deletePermanentLibrary = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const deletedLibrary = await deletePermanent(libraryId || '');
  res.locals["message"] = "delete permanent library"
  res.locals["documentId"] = libraryId;
  res.locals["collectionName"] = "Library";
  res.locals["changes"] = { isDeleted: true };
  res.status(200).json({
    success: true,
    data: deletedLibrary,
    message: 'Library permanently deleted successfully',
  });
});

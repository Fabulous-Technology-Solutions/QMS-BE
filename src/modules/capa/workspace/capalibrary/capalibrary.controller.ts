import catchAsync from './../../../utils/catchAsync';
import { Request, Response } from 'express';
import { CreateLibrary,getLibraryById,getLibrariesByWorkspace,updateLibrary,deleteLibrary,getLibrariesNames,removeMemberFromLibrary, getLibraryMembers, addMemberToLibrary ,updateForm5W2H} from './capalibrary.service';



export const createLibrary = catchAsync(async (req: Request, res: Response) => {
  const library = await CreateLibrary({...req.body,createdBy: req.user._id});
  res.status(201).json({
    success: true,
    message: 'Library created successfully',
    data: library,
  });
});


export const updateLibraryById = catchAsync(async (req: Request, res: Response) => {
  const library = await updateLibrary(req.params["libraryId"] as string, req.body);
  res.status(200).json({
    success: true,
    message: 'Library updated successfully',
    data: library,
  });
})


export const   getLibrary = catchAsync(async (req: Request, res: Response) => {
  const library = await getLibraryById(req.params["libraryId"] as string);

  res.status(200).json({
    success: true,
    message: 'Library retrieved successfully',
    data: library,
  });
});


export const getLibraries = catchAsync(async (req: Request, res: Response) => {
  console.log('Fetching libraries for workspace:', req.params['workspaceId']);
  const { workspaceId } = req.params;
  const { page = 1, limit = 10, search = '' } = req.query;

  const libraries = await getLibrariesByWorkspace(workspaceId || "", Number(page), Number(limit), search as string);
  console.log('Libraries retrieved:', libraries);

  res.status(200).json(libraries);
})

export const deleteLibraryById = catchAsync(async (req: Request, res: Response) => {
  const library = await deleteLibrary(req.params["libraryId"] as string);
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
  const updatedLibrary = await removeMemberFromLibrary(libraryId || "", memberId || "");
  res.status(200).json({
    success: true,
    data: updatedLibrary,
    message: 'Member removed from library successfully',
  });
});

export const getLibraryMembersController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const { page = 1, limit = 10, search = '' } = req.query;

  const members = await getLibraryMembers(libraryId || "", Number(page), Number(limit),search as string );

  res.status(200).json({
    success: true,
    data: members,
    message: 'Library members retrieved successfully',
  });
});

export const addMemberToLibraryController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const { members } = req.body;


  const updatedLibrary = await addMemberToLibrary(libraryId || "", members);

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

  const updatedLibrary = await updateForm5W2H(libraryId || "", form5W2H);

 return res.status(200).json({
    success: true,
    data: updatedLibrary,
    message: 'Form5W2H updated successfully',
  });
});
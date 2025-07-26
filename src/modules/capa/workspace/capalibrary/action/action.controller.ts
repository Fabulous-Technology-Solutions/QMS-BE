import  catchAsync  from "../../../../utils/catchAsync";
import { Request, Response } from 'express';
import * as actionService from './action.service';

export const createActionController = catchAsync(async (req: Request, res: Response) => {
  const action = await actionService.createAction({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({
    success: true,
    message: 'Action created successfully',
    data: action,
  });
});

export const getActionByIdController = catchAsync(async (req: Request, res: Response) => {
  const action = await actionService.getActionById(req.params["actionId"] || '');
  res.status(200).json({
    success: true,
    message: 'Action retrieved successfully',
    data: action,
  });
});

export const updateActionController = catchAsync(async (req: Request, res: Response) => {
  const action = await actionService.updateAction(req.params["actionId"] || '', req.body);
  res.status(200).json({
    success: true,
    message: 'Action updated successfully',
    data: action,
  });
});

export const getLibraryMembersByActionController = catchAsync(async (req: Request, res: Response) => {
  const { library } = req.params;
  const { search = '', page = 1, limit = 10 } = req.query;

  const members = await actionService.getLibraryMembersByAction(library, search as string, Number(page), Number(limit));

  res.status(200).json({
    success: true,
    message: 'Library members retrieved successfully',
    data: members,
  });
});
export const getActionsByLibraryController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;

  const actions = await actionService.getActionsByLibrary(libraryId as string, Number(req.query["page"]) || 1, Number(req.query["limit"]) || 10, req.query["search"] as string);

  res.status(200).json({
    success: true,
    message: 'Actions retrieved successfully',
    data: actions,
  });
});
export const deleteActionController = catchAsync(async (req: Request, res: Response) => {
  const action = await actionService.deleteAction(req.params["actionId"] || '');
  res.status(200).json({
    success: true,
    message: 'Action deleted successfully',
    data: action,
  });
});



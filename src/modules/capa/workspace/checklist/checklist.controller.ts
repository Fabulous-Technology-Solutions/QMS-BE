import  catchAsync  from "../../../utils/catchAsync";
import { Request, Response } from 'express';
import * as checklistService from './checklist.services';


export const createChecklist = catchAsync(async (req: Request, res: Response) => { 
  const checklist = await checklistService.createCheckList({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: 'Checklist created successfully',
    data: checklist,
  });
});

export const getChecklistById = catchAsync(async (req: Request, res: Response) => {
  const checklist = await checklistService.getCheckListById(req.params['checklistId'] as string);
  res.status(200).json({
    success: true,
    message: 'Checklist retrieved successfully',
    data: checklist,
  });
});

export const updateChecklist = catchAsync(async (req: Request, res: Response) => {
  const checklist = await checklistService.updateCheckList(req.params['checklistId'] as string, req.body);
  res.status(200).json({
    success: true,
    message: 'Checklist updated successfully',
    data: checklist,
  });
});

export const deleteChecklist = catchAsync(async (req: Request, res: Response) => {
  const checklist = await checklistService.deleteCheckList(req.params['checklistId'] as string);
  res.status(200).json({
    success: true,
    message: 'Checklist deleted successfully',
    data: checklist,
  });
});
export const getChecklistsByWorkspaceId = catchAsync(async (req: Request, res: Response) => {
  const checklists = await checklistService.getCheckListByWorkspaceId(req.params['workspaceId'] as string, req.query['search'] as string, Number(req.query["page"] || 1), Number(req.query["limit"] || 10 ));
  res.status(200).json({
    success: true,
    message: 'Checklists retrieved successfully',
    data: checklists,
  });
});


export const getChecklistNames = catchAsync(async (req: Request, res: Response) => {
  const checklistNames = await checklistService.getCheckListNamesByWorkspaceId(req.params['workspaceId'] as string);
  res.status(200).json({
    success: true,
    message: 'Checklist names retrieved successfully',
    data: checklistNames,
  });
});
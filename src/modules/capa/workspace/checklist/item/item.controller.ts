import  catchAsync  from "../../../../utils/catchAsync";


import { Request, Response } from 'express';
import * as checklistService from './item.services';

export const createChecklistItem = catchAsync(async (req: Request, res: Response) => {
  const checklistItem = await checklistService.createCheckListItem({
    ...req.body,
    createdBy: req.user._id,
    checklistId: req.params['checklistId'],
  });
  res.status(201).json({
    success: true,
    message: 'Checklist item created successfully',
    data: checklistItem,
  });
});

export const getChecklistItemById = catchAsync(async (req: Request, res: Response) => {
  const checklistItem = await checklistService.getCheckListItemById(req.params['itemId'] as string);
  res.status(200).json({
    success: true,
    message: 'Checklist item retrieved successfully',
    data: checklistItem,
  });
});


export const updateChecklistItem = catchAsync(async (req: Request, res: Response) => {
  const checklistItem = await checklistService.updateCheckListItem(req.params['itemId'] as string, req.body);
  res.status(200).json({
    success: true,
    message: 'Checklist item updated successfully',
    data: checklistItem,
  });
});



export const deleteChecklistItem = catchAsync(async (req: Request, res: Response) => {
  const checklistItem = await checklistService.deleteCheckListItem(req.params['itemId'] as string);
  res.status(200).json({
    success: true,
    message: 'Checklist item deleted successfully',
    data: checklistItem,
  });
});

export const getChecklistItemsByChecklistId = catchAsync(async (req: Request, res: Response) => {
  const checklistItems = await checklistService.getCheckListItemsByChecklistId(req.params['checklistId'] as string);
  res.status(200).json({
    success: true,
    message: 'Checklist items retrieved successfully',
    data: checklistItems,
  });
});

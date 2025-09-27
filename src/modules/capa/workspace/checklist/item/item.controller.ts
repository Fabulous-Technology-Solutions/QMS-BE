import catchAsync from '../../../../utils/catchAsync';

import { Request, Response } from 'express';
import * as checklistService from './item.services';
import AppiError from '../../../../errors/ApiError';
import { CreateItemsArraySchema, UpdateItemsArraySchema } from './item.validation';
import JoiError from '../../../../errors/JoiError';

export const createChecklistItem = catchAsync(async (req: Request, res: Response) => {
  const checklistItemsArray = req.body.checklistItems;

  const { error } = CreateItemsArraySchema.body.validate(checklistItemsArray);

  if (error) {
    const errorFields = JoiError(error);
    throw new AppiError('Invalid request', 400, errorFields);
  }
  const checklistId = req.params['checklistId'];
  const createdBy = req.user._id;

  const createdItems = await Promise.all(
    checklistItemsArray.map((item: any) =>
      checklistService.createCheckListItem({
        ...item,
        createdBy,
        checklistId,
      })
    )
  );

  res.status(201).json({
    success: true,
    message: 'Checklist items created successfully',
    data: createdItems,
  });
});

export const updateChecklistItem = catchAsync(async (req: Request, res: Response) => {
  const updateItemsArray = req.body.checklistItems;
  const { error } = UpdateItemsArraySchema.body.validate(updateItemsArray, { abortEarly: false ,allowUnknown: true});

  if (error) {
    const errorFields = JoiError(error);
    throw new AppiError('Invalid request', 400, errorFields);
  }
  const updatedItems = await Promise.all(
    updateItemsArray.map((item: any) => checklistService.updateCheckListItem(item._id, item.data))
  );

  res.status(200).json({
    success: true,
    message: 'Checklist items updated successfully',
    data: updatedItems,
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

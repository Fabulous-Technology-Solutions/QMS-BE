import catchAsync from '../../../../utils/catchAsync';
import { Request, Response } from 'express';
import * as historyService from './checklisthistory.services';

// Create a new checklist history entry
export const createChecklistHistoryController = catchAsync(async (req: Request, res: Response) => {
  const createdBy = (req.user as any)._id;
  const data = { ...req.body, createdBy };
  const history = await historyService.createChecklistHistory(data);
  res.status(201).json({ success: true, data: history });
});

// Get a single checklist history by its ID
export const getChecklistHistoryByIdController = catchAsync(async (req: Request, res: Response) => {
  const { historyId } = req.params as { historyId: string };
  const history = await historyService.getChecklistHistoryById(historyId);
  res.status(200).json({ success: true, data: history });
});

// List histories by library with pagination
export const getChecklistHistoriesByLibraryController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params as { libraryId: string };
  const page = Number(req.query["page"] as string) || 1;
  const limit = Number(req.query["limit"] as string) || 10;
  const result = await historyService.getChecklistHistoriesByLibrary(libraryId, page, limit);
  res.status(200).json({ success: true, ...result });
});

// Update an existing checklist history entry
export const updateChecklistHistoryController = catchAsync(async (req: Request, res: Response) => {
  const { historyId } = req.params as { historyId: string };
  const updated = await historyService.updateChecklistHistory(historyId, req.body);
  res.status(200).json({ success: true, data: updated });
});

// Delete a checklist history entry
export const deleteChecklistHistoryController = catchAsync(async (req: Request, res: Response) => {
  const { historyId } = req.params as { historyId: string };
  await historyService.deleteChecklistHistory(historyId);
  res.status(204).send();
});

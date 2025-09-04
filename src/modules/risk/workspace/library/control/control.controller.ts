import * as controlService from './control.services';
import catchAsync from '../../../../utils/catchAsync';
import { Request, Response } from 'express';

const createControl = catchAsync(async (req: Request, res: Response) => {
  const control = await controlService.createActionService({ ...req.body, createdBy: req.user?._id });
  res.locals['documentId'] = control._id;
  res.locals['collectionName'] = 'Control';
  res.locals['action'] = 'create';
  res.locals['message'] = 'create control';
  res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
  res.locals['changes'] = control;
  res.status(201).json({ success: true, data: control });
});
const getAllControls = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  const search = req.query['search'] as string | undefined;

  const controls = await controlService.getAllControlService(libraryId as string, page, limit, search);
  res.status(200).json({ success: true, data: controls });
});
const getControlById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const control = await controlService.getControlByIdService(id as string);
  res.status(200).json({ success: true, data: control });
});
const updateControl = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const control = await controlService.updateControlService(id as string, req.body);
  res.locals['documentId'] = control._id;
  res.locals['collectionName'] = 'Control';
  res.locals['action'] = 'update';
  res.locals['message'] = 'update control';
  res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
  res.locals['changes'] = control;
  res.status(200).json({ success: true, data: control });
});
const deleteControl = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const control = await controlService.deleteControlService(id as string);
  res.locals['documentId'] = control._id;
  res.locals['collectionName'] = 'Control';
  res.locals['action'] = 'delete';
  res.locals['message'] = 'delete control';
  res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
  res.locals['changes'] = { isDeleted: true };
  res.status(200).json({ success: true, data: control });
});

export { createControl, getAllControls, getControlById, updateControl, deleteControl };

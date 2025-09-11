import {createReportHistory} from './reporthistory.services';
import  catchAsync  from '../../../../utils/catchAsync';
import { Request, Response } from 'express';

const createReportHistoryController = catchAsync(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const reportHistory = await createReportHistory(libraryId as string);
  res.status(201).json(reportHistory);
});


export { createReportHistoryController };
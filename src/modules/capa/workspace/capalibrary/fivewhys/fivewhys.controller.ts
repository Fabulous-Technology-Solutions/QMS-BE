import * as FiveWhyService from './fivewhys.service';
import catchAsync  from '../../../../utils/catchAsync';
import { Request, Response } from 'express';

export const createFiveWhys = catchAsync(async (req: Request, res: Response) => {
  const fiveWhys = await FiveWhyService.createFiveWhys({ ...req.body, libraryId: req.params["libraryId"] });
  res.locals["message"] = "Five Whys created";
  res.locals["documentId"] = fiveWhys._id;
  res.locals["collectionName"] = "FiveWhys";
  res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
  res.locals["changes"] = fiveWhys;
  res.status(201).json(fiveWhys);
});

export const getFiveWhys = catchAsync(async (req: Request, res: Response) => {
  const fiveWhys = await FiveWhyService.getFiveWhys(req.params["fivewhysid"]||"");
  res.status(200).json(fiveWhys);
});

export const updateFiveWhys = catchAsync(async (req: Request, res: Response) => {
  const fiveWhys = await FiveWhyService.updateFiveWhys(req.params["fivewhysid"]||"", req.body);
  res.locals["message"] = "Five Whys updated";
  res.locals["documentId"] = fiveWhys?._id;
  res.locals["collectionName"] = "FiveWhys";
  res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
  res.locals["changes"] = fiveWhys;
  res.status(200).json(fiveWhys);
});

export const deleteFiveWhys = catchAsync(async (req: Request, res: Response) => {
  await FiveWhyService.deleteFiveWhys(req.params["fivewhysid"]||"");
  res.locals["message"] = "Five Whys deleted";
  res.locals["documentId"] = req.params["fivewhysid"];
  res.locals["collectionName"] = "FiveWhys";
  res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
  res.status(204).send();
});

export const getFiveWhysByLibrary = catchAsync(async (req: Request, res: Response) => {
  const fiveWhys = await FiveWhyService.getFiveWhysByLibrary(req.params["libraryId"] || "", Number(req.query["page"]), Number(req.query["limit"]));
  res.status(200).json(fiveWhys);
});

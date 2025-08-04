import  catchAsync  from "../../../../utils/catchAsync";
import * as causeService from "./causes.service";
import { Request, Response } from "express";

export const createCause = catchAsync(async (req: Request, res: Response) => {
    const cause = await causeService.createCauses(req.body);
    res.locals["message"] = "create cause";
    res.locals["documentId"] = cause._id;
    res.locals["collectionName"] = "Cause";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = cause;
    res.status(201).json(cause);
});
export const updateCause = catchAsync(async (req: Request, res: Response) => {
    const { causeId } = req.params;
    const updatedCause = await causeService.updateCauses(causeId || "", req.body);
    res.locals["message"] = "update cause"; 
    res.locals["documentId"] = updatedCause._id;
    res.locals["collectionName"] = "Cause";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = updatedCause;
    res.status(200).json(updatedCause);
});
export const deleteCause = catchAsync(async (req: Request, res: Response) => {
    const { causeId } = req.params;
    const deletedCause = await causeService.deleteCauses(causeId as string);
    res.locals["message"] = "delete cause";
    res.locals["documentId"] = deletedCause._id;
    res.locals["collectionName"] = "Cause";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.status(200).json(deletedCause);
});
export const getCauseById = catchAsync(async (req: Request, res: Response) => {
    const { causeId } = req.params;
    const cause = await causeService.getCausesById(causeId as string);
    res.status(200).json(cause);
});
export const getCausesByLibrary = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query as any;
    const causes = await causeService.getCausesByLibrary(libraryId || "", Number(page || 1), Number(limit || 10), search);
    res.status(200).json(causes);
});

export const getCausesNamesByLibrary = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const causes = await causeService.getNamesByLibrary(libraryId as string);
    res.status(200).json(causes);
});

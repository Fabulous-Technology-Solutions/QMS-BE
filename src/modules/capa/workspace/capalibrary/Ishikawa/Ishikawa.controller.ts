import * as IshikawaService from "./Ishikawa.services"
import { catchAsync } from "../../../../utils"
import { Request, Response } from "express";

const createIshikawa = catchAsync(async (req: Request, res: Response) => {
    const newIshikawa = await IshikawaService.createIshikawa({...req.body, createdBy: req.user.id});
    res.locals["message"] = "create Ishikawa";
    res.locals["documentId"] = newIshikawa._id || "";
    res.locals["collectionName"] = "Ishikawa";
    res.locals["action"] = "create";
    res.locals["changes"] = newIshikawa;
    res.locals['logof'] = req.body.library || null;

    res.status(201).json(newIshikawa);
});

const getIshikawaById = catchAsync(async (req: Request, res: Response) => {
    const ishikawa = await IshikawaService.getIshikawaById(req.params['id'] as string);
    res.status(200).json(ishikawa);
});

const getIshikawaByLibraryId = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { page, limit, search } = req.query;
    const ishikawaList = await IshikawaService.getIshikawaByLibraryId(libraryId as string, Number(page), Number(limit), search as string);
    res.status(200).json(ishikawaList);
});

const deleteIshikawa = catchAsync(async (req: Request, res: Response) => {
    await IshikawaService.deleteIshikawa(req.params['id'] as string);
    res.locals["message"] = "delete Ishikawa";
    res.locals["documentId"] = req.params['id'] as string;
    res.locals["collectionName"] = "Ishikawa";
    res.locals["action"] = "delete";
    res.locals["changes"] = null;
    res.locals['logof'] = req.params['libraryId'] as string;
    res.status(204).send({
        message:"delete Ishikawa successfully"
    });
});

export {
    createIshikawa,
    getIshikawaById,
    getIshikawaByLibraryId,
    deleteIshikawa
};
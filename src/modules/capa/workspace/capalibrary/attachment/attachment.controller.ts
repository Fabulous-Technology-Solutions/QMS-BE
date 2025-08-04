import  catchAsync  from "../../../../utils/catchAsync";
import *  as AttachmentService from "./attachment.services";
import { Request, Response } from "express";

export const createAttachment = catchAsync(async (req: Request, res: Response) => {
    const attachment = await AttachmentService.createAttachment(req.body);
    res.locals["message"] = "create attachment";
    res.locals["documentId"] = attachment._id;
    res.locals["collectionName"] = "Attachment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = attachment;
    res.status(201).json(attachment);
});

export const updateAttachment = catchAsync(async (req: Request, res: Response) => {
    const { attachmentId } = req.params;
    const updatedAttachment = await AttachmentService.updateAttachment(attachmentId || "", req.body);
    res.locals["message"] = "update attachment";
    res.locals["documentId"] = updatedAttachment._id;
    res.locals["collectionName"] = "Attachment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = updatedAttachment;
    res.status(200).json(updatedAttachment);
});
export const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
    const { attachmentId } = req.params;
    const deletedAttachment = await AttachmentService.deleteAttachment(attachmentId);
    res.locals["message"] = "delete attachment";
    res.locals["documentId"] = deletedAttachment._id;
    res.locals["collectionName"] = "Attachment";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.body.library || req.params['libraryId'] ||
    res.status(200).json(deletedAttachment);
});
export const getAttachmentById = catchAsync(async (req: Request, res: Response) => {
    const { attachmentId } = req.params;
    const attachment = await AttachmentService.getAttachmentById(attachmentId);
    res.status(200).json(attachment);
});
export const getAttachmentsByWorkspace = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query as any;
    const attachments = await AttachmentService.getAttachmentsByLibrary(libraryId || "", Number(page || 1), Number(limit || 10), search);
    res.status(200).json(attachments);
});
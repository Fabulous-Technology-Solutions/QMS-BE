import {AttachmentController,AttachmentValidation} from "../../modules/capa/workspace/capalibrary/attachment"
import { Router } from "express";
import { validate } from "../../modules/validate";
import { auth } from "../../modules/auth";
import checkValidation from '../../modules/capa/workspace/capalibrary/capalibrary.middleware';

const router = Router();
router.post("/", auth("createAttachment"), checkValidation, validate(AttachmentValidation.createAttachmentSchema), AttachmentController.createAttachment);
router.patch("/libraries/:libraryId/attachment/:attachmentId", auth("updateAttachment"), checkValidation, validate(AttachmentValidation.updateAttachmentSchema), AttachmentController.updateAttachment);
router.delete("/libraries/:libraryId/attachment/:attachmentId", auth("deleteAttachment"), checkValidation, AttachmentController.deleteAttachment);
router.get("/libraries/:libraryId/attachment/:attachmentId", auth("getAttachmentById"), checkValidation, AttachmentController.getAttachmentById);
router.get("/libraries/:libraryId/attachments", auth("getAttachmentsByWorkspace"), checkValidation, AttachmentController.getAttachmentsByWorkspace);

export default router;

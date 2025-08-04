import {AttachmentController,AttachmentValidation} from "../../modules/capa/workspace/capalibrary/attachment"
import { Router } from "express";
import { validate } from "../../modules/validate";
import { auth } from "../../modules/auth";
import checkValidation from '../../modules/capa/workspace/capalibrary/capalibrary.middleware';
import { activityLoggerMiddleware } from "../../modules/activitylogs/activitylogs.middleware";

const router = Router();
router.post("/", auth("createAttachment"), checkValidation, validate(AttachmentValidation.createAttachmentSchema), activityLoggerMiddleware,AttachmentController.createAttachment);
router.patch("/libraries/:libraryId/attachment/:attachmentId", auth("updateAttachment"), checkValidation, activityLoggerMiddleware,validate(AttachmentValidation.updateAttachmentSchema), AttachmentController.updateAttachment);
router.delete("/libraries/:libraryId/attachment/:attachmentId", auth("deleteAttachment"), checkValidation, activityLoggerMiddleware, AttachmentController.deleteAttachment);
router.get("/libraries/:libraryId/attachment/:attachmentId", auth("getAttachmentById"), checkValidation, AttachmentController.getAttachmentById);
router.get("/libraries/:libraryId/attachments", auth("getAttachmentsByWorkspace"), checkValidation, AttachmentController.getAttachmentsByWorkspace);

export default router;

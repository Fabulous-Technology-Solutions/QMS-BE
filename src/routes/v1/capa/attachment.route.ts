import {AttachmentController,AttachmentValidation} from "../../../modules/capa/workspace/capalibrary/attachment"
import { Router } from "express";
import { validate } from "../../../modules/validate";
import { auth } from "../../../modules/auth";
import checkValidation from '../../../modules/capa/workspace/capalibrary/capalibrary.middleware';
import { activityLoggerMiddleware } from "../../../modules/activitylogs/activitylogs.middleware";

const router = Router();
router.post("/", auth("createAttachment"), checkValidation, validate(AttachmentValidation.createAttachmentSchema), activityLoggerMiddleware,AttachmentController.create);
router.patch("/libraries/:libraryId/attachment/:attachmentId", auth("updateAttachment"), checkValidation, activityLoggerMiddleware,validate(AttachmentValidation.updateAttachmentSchema), AttachmentController.update);
router.delete("/libraries/:libraryId/attachment/:attachmentId", auth("deleteAttachment"), checkValidation, activityLoggerMiddleware, AttachmentController.delete);
router.get("/libraries/:libraryId/attachment/:attachmentId", auth("getAttachmentById"), checkValidation, AttachmentController.getById);
router.get("/libraries/:libraryId/attachments", auth("getAttachmentsByWorkspace"), checkValidation, AttachmentController.getByLibrary);

export default router;

import {AttachmentController,AttachmentValidation} from "../../../modules/risk/workspace/library/attachment"
import { Router } from "express";
import { validate } from "../../../modules/validate";
import { auth } from "../../../modules/auth";
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from "../../../modules/activitylogs/activitylogs.middleware";

const router = Router();
router.post("/", auth("Risk_createAttachment"), checkValidation, validate(AttachmentValidation.createAttachmentSchema), activityLoggerMiddleware,AttachmentController.create);
router.patch("/libraries/:libraryId/attachment/:attachmentId", auth("Risk_updateAttachment"), checkValidation, activityLoggerMiddleware,validate(AttachmentValidation.updateAttachmentSchema), AttachmentController.update);
router.delete("/libraries/:libraryId/attachment/:attachmentId", auth("Risk_deleteAttachment"), checkValidation, activityLoggerMiddleware, AttachmentController.delete);
router.get("/libraries/:libraryId/attachment/:attachmentId", auth("Risk_getAttachmentById"), checkValidation, AttachmentController.getById);
router.get("/libraries/:libraryId/attachments", auth("Risk_getAttachmentsByWorkspace"), checkValidation, AttachmentController.getByLibrary);

export default router;

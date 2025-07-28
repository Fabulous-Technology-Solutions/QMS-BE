import {AttachmentController,AttachmentValidation} from "../../modules/capa/workspace/capalibrary/attachment"
import { Router } from "express";
import { validate } from "../../modules/validate";
import { auth } from "../../modules/auth";

const router = Router();
router.post("/", auth("createAttachment"), validate(AttachmentValidation.createAttachmentSchema), AttachmentController.createAttachment);
router.patch("/libraries/:libraryId/attachment/:attachmentId", auth("updateAttachment"), validate(AttachmentValidation.updateAttachmentSchema), AttachmentController.updateAttachment);
router.delete("/libraries/:libraryId/attachment/:attachmentId", auth("deleteAttachment"), AttachmentController.deleteAttachment);
router.get("/libraries/:libraryId/attachment/:attachmentId", auth("getAttachmentById"), AttachmentController.getAttachmentById);
router.get("/libraries/:libraryId/attachments", auth("getAttachmentsByWorkspace"), AttachmentController.getAttachmentsByWorkspace);

export default router;

import  Attachment from "./attachment.modal";
import * as AttachmentValidation from "../../../../../shared/attachment/attachment.validation";
import { AttachmentServices}  from "../../../../../shared/attachment/attachment.service";
import { AttachmentControllers } from "../../../../../shared/attachment/attachment.controller";
const AttachmentService = new AttachmentServices(Attachment);
const AttachmentController= new AttachmentControllers(AttachmentService,'Attachment');
export { Attachment, AttachmentController, AttachmentService, AttachmentValidation };
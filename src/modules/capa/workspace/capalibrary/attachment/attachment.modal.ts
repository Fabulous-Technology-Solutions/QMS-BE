import { AttachmentModal } from "../../../../../shared/attachment/attachment.interfaces";
import AttachmentSchema from "../../../../../shared/attachment/attachment.schema";
import mongoose from "mongoose";
AttachmentSchema.add({
     library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true }
})
const AttachmentModal = mongoose.model<AttachmentModal>('Attachment', AttachmentSchema);
export default AttachmentModal;
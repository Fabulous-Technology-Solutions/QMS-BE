import { AttachmentModal } from "../../../../../shared/attachment/attachment.interfaces";
import AttachmentSchema from "../../../../../shared/attachment/attachment.schema";
import mongoose from "mongoose";
AttachmentSchema.add({
     library: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true }
})
const AttachmentModal = mongoose.model<AttachmentModal>('RiskAttachment', AttachmentSchema);
export default AttachmentModal;
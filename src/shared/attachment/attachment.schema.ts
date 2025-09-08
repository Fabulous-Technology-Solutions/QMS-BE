import { AttachmentModal } from "./attachment.interfaces"
import mongoose from "mongoose";
const AttachmentSchema = new mongoose.Schema<AttachmentModal>({
    name: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileKey: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        enum: ["image/jpeg", "image/png", "application/pdf"],
        required: true,
    },
    size: {
        type: Number,
        min: 0,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export default AttachmentSchema;
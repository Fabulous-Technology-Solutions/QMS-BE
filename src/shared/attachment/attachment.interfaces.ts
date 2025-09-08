import mongoose, { Document } from "mongoose";

export interface AttachmentModal extends Document {
    name: string;
    fileUrl: string;
    fileKey: string;
    fileType: string;
    size: number;
    library: mongoose.Types.ObjectId;
    isDeleted?: boolean;
}

export interface CreateAttachmentRequest {
    name: string;
    fileUrl: string;
    fileKey: string;
    fileType: string;
    size: number;
    library: string;
}

export interface GetattachmentQuery {
    library?: string;
    isDeleted?: boolean;
    name?: {
        $regex?: string;
        $options?: string;
    }
}
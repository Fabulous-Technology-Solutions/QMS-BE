import mongoose from "mongoose";

export interface AttachmentModal extends Document {
    name: string;
    fileUrl: string;
    fileKey: string;
    fileType: string;
    size: number;
    workspace: mongoose.Types.ObjectId;
    isDeleted?: boolean;
}

export interface CreateAttachmentRequest {
    name: string;
    fileUrl: string;
    fileKey: string;
    fileType: string;
    size: number;
    workspace: string;
}

export interface GetattachmentQuery {
    workspace?: string;
    isDeleted?: boolean;
    name?: {
        $regex?: string;
        $options?: string;
    }
}
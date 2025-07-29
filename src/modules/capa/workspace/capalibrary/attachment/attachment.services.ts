import Attachment from "./attachment.modal"
import { CreateAttachmentRequest, GetattachmentQuery } from "./attachment.interfaces";
import { deleteMedia } from "../../../../upload/upload.middleware";

export const createAttachment = async (body: CreateAttachmentRequest) => {
    const attachment = new Attachment(body);
    return await attachment.save();
};

export const updateAttachment = async (attachmentId: string, updateData: Partial<CreateAttachmentRequest>) => {
    const attachment = await Attachment.findOneAndUpdate(
        { _id: attachmentId, isDeleted: false },
        updateData,
        { new: false }
    );
    if (!attachment) {
        throw new Error('Attachment not found');
    }
    if (updateData.fileKey) {
        await deleteMedia(attachment.fileKey);
    }
    Object.assign(attachment, updateData);
    return attachment;
};


export const deleteAttachment = async (attachmentId?: string) => {
    const attachment = await Attachment.findOneAndUpdate(
        { _id: attachmentId, isDeleted: false },
        { isDeleted: true },
        { new: false }
    );
    if (!attachment) {
        throw new Error('Attachment not found');
    }
    if (attachment.fileKey) {
        await deleteMedia(attachment.fileKey);
    }
    return attachment;
};


export const getAttachmentById = async (attachmentId?: string) => {
    const attachment = await Attachment.findOne({ _id: attachmentId, isDeleted: false });
    if (!attachment) {
        throw new Error('Attachment not found');
    }
    return attachment;
};

export const getAttachmentsByLibrary = async (libraryId: string, page: number, limit: number, search: string) => {
    const query: GetattachmentQuery = { library: libraryId, isDeleted: false };

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const attachments = await Attachment.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Attachment.countDocuments(query);

    return {
        data: attachments,
        total,
        page,
        limit,
        success: true,
        message: 'Attachments retrieved successfully',
    };
}
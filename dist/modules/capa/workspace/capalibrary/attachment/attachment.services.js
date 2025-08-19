"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachmentsByLibrary = exports.getAttachmentById = exports.deleteAttachment = exports.updateAttachment = exports.createAttachment = void 0;
const attachment_modal_1 = __importDefault(require("./attachment.modal"));
const upload_middleware_1 = require("../../../../upload/upload.middleware");
const createAttachment = async (body) => {
    const attachment = new attachment_modal_1.default(body);
    return await attachment.save();
};
exports.createAttachment = createAttachment;
const updateAttachment = async (attachmentId, updateData) => {
    const attachment = await attachment_modal_1.default.findOneAndUpdate({ _id: attachmentId, isDeleted: false }, updateData, { new: false });
    if (!attachment) {
        throw new Error('Attachment not found');
    }
    if (updateData.fileKey) {
        await (0, upload_middleware_1.deleteMedia)(attachment.fileKey);
    }
    Object.assign(attachment, updateData);
    return attachment;
};
exports.updateAttachment = updateAttachment;
const deleteAttachment = async (attachmentId) => {
    const attachment = await attachment_modal_1.default.findOneAndUpdate({ _id: attachmentId, isDeleted: false }, { isDeleted: true }, { new: false });
    if (!attachment) {
        throw new Error('Attachment not found');
    }
    if (attachment.fileKey) {
        await (0, upload_middleware_1.deleteMedia)(attachment.fileKey);
    }
    return attachment;
};
exports.deleteAttachment = deleteAttachment;
const getAttachmentById = async (attachmentId) => {
    const attachment = await attachment_modal_1.default.findOne({ _id: attachmentId, isDeleted: false });
    if (!attachment) {
        throw new Error('Attachment not found');
    }
    return attachment;
};
exports.getAttachmentById = getAttachmentById;
const getAttachmentsByLibrary = async (libraryId, page, limit, search) => {
    const query = { library: libraryId, isDeleted: false };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const attachments = await attachment_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await attachment_modal_1.default.countDocuments(query);
    return {
        data: attachments,
        total,
        page,
        limit,
        success: true,
        message: 'Attachments retrieved successfully',
    };
};
exports.getAttachmentsByLibrary = getAttachmentsByLibrary;

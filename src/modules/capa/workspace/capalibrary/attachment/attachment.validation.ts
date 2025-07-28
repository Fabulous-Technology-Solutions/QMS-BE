import Joi from "joi"
import {CreateAttachmentRequest } from "./attachment.interfaces"

const attachmentBody: Record<keyof CreateAttachmentRequest, Joi.Schema> = {
    name: Joi.string().required(),
    fileUrl: Joi.string().uri().required(),
    fileKey: Joi.string().required(),
    fileType: Joi.string().valid(
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/csv",
        "application/zip",
        "application/x-rar-compressed"
    ).required(),
    size: Joi.number().min(0).required(),
    library: Joi.string().required(),
};

export const createAttachmentSchema = Joi.object().keys(attachmentBody).fork(['name', 'fileUrl', 'fileKey', 'fileType', 'size', 'library'], (schema) => schema.required()).messages({
  "any.required": `"{{#label}}" is a required field`,
});
export const updateAttachmentSchema = Joi.object().keys(attachmentBody).min(1).messages({
  "object.min": "At least one field must be provided for update"
});


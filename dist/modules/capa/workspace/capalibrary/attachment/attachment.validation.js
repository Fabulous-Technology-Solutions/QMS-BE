"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttachmentSchema = exports.createAttachmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const attachmentBody = {
    name: joi_1.default.string().required(),
    fileUrl: joi_1.default.string().uri().required(),
    fileKey: joi_1.default.string().required(),
    fileType: joi_1.default.string().valid("image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/csv", "application/zip", "application/x-rar-compressed").required(),
    size: joi_1.default.number().min(0).required(),
    library: joi_1.default.string().required(),
};
exports.createAttachmentSchema = joi_1.default.object().keys(attachmentBody).fork(['name', 'fileUrl', 'fileKey', 'fileType', 'size', 'library'], (schema) => schema.required()).messages({
    "any.required": `"{{#label}}" is a required field`,
});
exports.updateAttachmentSchema = joi_1.default.object().keys(attachmentBody).min(1).messages({
    "object.min": "At least one field must be provided for update"
});

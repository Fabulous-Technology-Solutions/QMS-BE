import Joi from "joi"
import {CreateAttachmentRequest } from "./attachment.interfaces"

const attachmentBody:Record<keyof CreateAttachmentRequest, Joi.Schema> = {
  name: Joi.string().required(),
  fileUrl: Joi.string().uri().required(),
  fileKey: Joi.string().required(),
  fileType: Joi.string().valid("image/jpeg", "image/png", "application/pdf").required(),
  size: Joi.number().min(0).required(),
  workspace: Joi.string().required(), 
};

export const createAttachmentSchema = Joi.object().keys(attachmentBody).fork(['name', 'fileUrl', 'fileKey', 'fileType', 'size', 'workspace'], (schema) => schema.required()).messages({
  "any.required": `"{{#label}}" is a required field`,
});
export const updateAttachmentSchema = Joi.object().keys(attachmentBody).min(1).messages({
  "object.min": "At least one field must be provided for update"
});


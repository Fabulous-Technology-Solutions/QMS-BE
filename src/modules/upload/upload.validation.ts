const Joi = require('joi');
import { CompleteUpload, IinitateUpload, IPressignedUrl } from './upload.interfaces';
const initiateUploadBody: Record<keyof IinitateUpload, any> = {
    fileName: Joi.string().trim().min(3).required(),
    filetype: Joi.string()
        .valid('image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'video/mp4')
        .required()
};
export const initiateUploadSchema = {
    body: Joi.object().keys(initiateUploadBody)
}


const PresignedUrlSchema: Record<keyof IPressignedUrl, any> = {
    fileName: Joi.string().trim().min(3).required(),
    uploadId: Joi.string().trim().required(),
    filetype: Joi.string()
        .valid('image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'video/mp4')
        .required(),
    numChunks: Joi.number().integer().min(1).max(1000).required()
}
export const generatePresignedUrlSchema = {
    body: Joi.object().keys(PresignedUrlSchema)
}


const completeUploadBody: Record<keyof CompleteUpload, any> = {
    fileName: Joi.string().trim().min(3).required(),
    uploadId: Joi.string().trim().required()
};

export const completeUploadSchema = {
    body: Joi.object().keys(completeUploadBody)
};

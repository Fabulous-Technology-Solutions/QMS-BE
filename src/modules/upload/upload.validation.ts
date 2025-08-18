const Joi = require('joi');
import { CompleteUpload, IinitateUpload, IPressignedUrl, ISingleFileUpload, IFilePathUpload } from './upload.interfaces';
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

// Single file upload validation (non-multipart)
const singleFileUploadBody: Record<keyof ISingleFileUpload, any> = {
    fileName: Joi.string().trim().min(1).required(),
    fileContent: Joi.string().required(),
    contentType: Joi.string()
        .valid(
            'image/png', 
            'image/jpeg', 
            'image/jpg', 
            'image/gif',
            'image/webp',
            'application/pdf', 
            'video/mp4',
            'video/avi',
            'video/mov',
            'text/plain',
            'text/csv',
            'application/json',
            'application/xml',
            'application/zip',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        .required(),
    isBase64: Joi.boolean().optional().default(true)
};

export const singleFileUploadSchema = {
    body: Joi.object().keys(singleFileUploadBody)
};

// File path upload validation
const filePathUploadBody: Record<keyof IFilePathUpload, any> = {
    filePath: Joi.string().required(),
    fileName: Joi.string().trim().min(1).required(),
    contentType: Joi.string()
        .valid(
            'image/png', 
            'image/jpeg', 
            'image/jpg', 
            'image/gif',
            'image/webp',
            'application/pdf', 
            'video/mp4',
            'video/avi',
            'video/mov',
            'text/plain',
            'text/csv',
            'application/json',
            'application/xml',
            'application/zip',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        .required()
};

export const filePathUploadSchema = {
    body: Joi.object().keys(filePathUploadBody)
};

// JSON data upload validation
export const jsonDataUploadSchema = {
    body: Joi.object().keys({
        data: Joi.alternatives().try(
            Joi.object(),
            Joi.array(),
            Joi.string(),
            Joi.number(),
            Joi.boolean()
        ).required(),
        fileName: Joi.string().trim().min(1).required()
    })
};

export interface IinitateUpload {
    fileName: string;
    filetype: string;
}

export interface IPressignedUrl {
    fileName: string;
    filetype: string;
    uploadId: string;
    numChunks: number;
}

export interface CompleteUpload {
    fileName: string;
    uploadId: string;
}

export interface IUploadChunk {
    index: number;
    fileName: string;
    uploadId: string;
    file: Express.Multer.File;
}
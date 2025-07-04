
import { CompleteUpload, IinitateUpload, IPressignedUrl ,IUploadChunk} from "./upload.interfaces";
import { completeMultipartUpload, createPresignedUrl, generateDownloadUrl, initiateMultipartUpload, uploadPart } from "./upload.middleware";

export const createInitateUpload = async (body: IinitateUpload) => {
    const { fileName, filetype } = body;

    // Initiate multipart upload
    const response = await initiateMultipartUpload(fileName, filetype);

    return response;
};


export const createpresignedUrl = async (body: IPressignedUrl) => {
    const { fileName, uploadId, numChunks } = body;

    // Generate presigned URLs for each part
    const presignedUrls = [];
    for (let i = 1; i <= numChunks; i++) {
        const url: string = await createPresignedUrl(fileName, uploadId, i);
        presignedUrls.push({ partNumber: i, url });
    }

    return { presignedUrls };
}


export const createcompleteUpload = async (body: CompleteUpload) => {
    const { fileName, uploadId } = body;

    // Complete the multipart upload
    const response = await completeMultipartUpload(fileName, uploadId);

    return response;
}


export const createUploadChunk = async (body: IUploadChunk) => {
    const { index, fileName, uploadId, file } = body;
   
    const response = await uploadPart(index, fileName, file.buffer, uploadId);

    return response;
}

export const createdownloadAwsObject= async(keyObject: string) => {
    const response = await generateDownloadUrl(keyObject);
    return response;
}
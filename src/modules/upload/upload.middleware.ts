import 'dotenv/config';
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand,
  ListPartsCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const validateEnvVars = () => {
  const requiredVars = {
    REGION: process.env['REGION'],
    AWS_ACCESS_KEY_ID: process.env['AWS_ACCESS_KEY_ID'],
    AWS_SECRET_ACCESS_KEY: process.env['AWS_SECRET_ACCESS_KEY'],
    AWS_STORAGE_BUCKET_NAME: process.env['AWS_STORAGE_BUCKET_NAME']
  };

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    REGION: requiredVars.REGION!,
    AWS_ACCESS_KEY_ID: requiredVars.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: requiredVars.AWS_SECRET_ACCESS_KEY!,
    AWS_STORAGE_BUCKET_NAME: requiredVars.AWS_STORAGE_BUCKET_NAME!
  };
};

const envVars = validateEnvVars();

const s3Client = new S3Client({
  region: envVars.REGION,
  credentials: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY
  }
});

const bucketName = envVars.AWS_STORAGE_BUCKET_NAME;

interface MultipartUploadResponse {
  uploadId: string;
}

interface Part {
  ETag?: string | undefined;
  PartNumber?: number | undefined;
}

const initiateMultipartUpload = async (fileName: string, fileType: string): Promise<MultipartUploadResponse> => {
  const command = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
    ACL: 'public-read'
  });
  const response = await s3Client.send(command);
  return { uploadId: response.UploadId! };
};

const createPresignedUrl = async (fileName: string, uploadId: string, partNumber: number): Promise<string> => {
  const command = new UploadPartCommand({
    Bucket: bucketName,
    Key: fileName,
    UploadId: uploadId,
    PartNumber: partNumber
  });
  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Upload part to S3
 */
const uploadPart = async (index: number, fileName: string, fileBuffer: Buffer, uploadId: string) => {
  const command = new UploadPartCommand({
    Bucket: bucketName,
    Key: fileName,
    UploadId: uploadId,
    PartNumber: Number(index) + 1,
    Body: fileBuffer
  });
  return s3Client.send(command);
};

const completeMultipartUpload = async (filename: string, uploadId: string) => {
  console.log('aya ma complete upload');

  const command = new ListPartsCommand({
    Bucket: bucketName,
    Key: filename,
    UploadId: uploadId
  });

  try {
    const data = await s3Client.send(command);
    console.log(data);
    if (!data) {
      throw new Error('data not provided for completing multipart upload.');
    }
    const parts = data?.Parts?.map((part: Part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber
    }));

    if (!parts || parts.length === 0) {
      throw new Error('No parts provided for completing multipart upload.');
    }
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: filename,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts }
    });

    const response = await s3Client.send(completeCommand);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const generateDownloadUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

const deleteMedia = async (key: string): Promise<any> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    const response = await s3Client.send(command);
    console.log(`Media deleted successfully: ${key}`);
    return response;
  } catch (error) {
    console.log(`Error deleting media ${key}:`, error);
    return null;
  }
};

export {
  initiateMultipartUpload,
  createPresignedUrl,
  uploadPart,
  completeMultipartUpload,
  generateDownloadUrl,
  deleteMedia
};

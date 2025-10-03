import { Document, ObjectId } from "mongoose";

export interface CausesModal extends Document {
    name: string;
    description: string;
    library: ObjectId;
    isDeleted: boolean;
    fileUrl?: string;
    fileKey?: string;

}

export interface CreateCausesRequest {
    name: string;
    description: string;
    library: string;
    fileUrl?: string;
    fileKey?: string;
}

export interface GetCausesQuery {
    library?: string;
    isDeleted?: boolean;
    name?: {
        $regex?: string;
        $options?: string;
    };
}
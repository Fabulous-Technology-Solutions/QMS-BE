import { Document, ObjectId } from "mongoose";

export interface CausesModal extends Document {
    name: string;
    description: string;
    library: ObjectId;
    isDeleted: boolean;

}

export interface CreateCausesRequest {
    name: string;
    description: string;
    library: string;
}

export interface GetCausesQuery {
    library?: string;
    isDeleted?: boolean;
    name?: {
        $regex?: string;
        $options?: string;
    };
}
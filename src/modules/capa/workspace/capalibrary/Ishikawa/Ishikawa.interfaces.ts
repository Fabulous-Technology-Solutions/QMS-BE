import mongoose, { Document } from "mongoose";

export interface CreateIshikawa extends Document {
    library: mongoose.Schema.Types.ObjectId;
    createdBy: mongoose.Schema.Types.ObjectId;
    problems: Array<{
        problem: string;
        category: Array<{
            name: string;
            cause: Array<{
                name: string;
                subCauses: Array<string>;
            }>;
        }>;
    }>;
}


export interface createIshikawaRequest{
    library: string;
    createdBy: string;
    problems: Array<{
        problem: string;
        category: Array<{
            name: string;
            cause: Array<{
                name: string;
                subCauses: Array<string>;
            }>;
        }>;
    }>;
}

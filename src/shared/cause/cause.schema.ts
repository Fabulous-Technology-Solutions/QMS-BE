import mongoose from "mongoose";
import {CausesModal} from './cause.interfaces';

const CausesSchema = new mongoose.Schema<CausesModal>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String,
        required: false,
    },
    fileKey: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});
export default CausesSchema;
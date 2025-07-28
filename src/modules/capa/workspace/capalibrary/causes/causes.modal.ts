import mongoose from "mongoose";
import {CausesModal} from './causes.interfaces';
const CausesSchema = new mongoose.Schema<CausesModal>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});
const Causes = mongoose.model<CausesModal>('Causes', CausesSchema);
export default Causes;
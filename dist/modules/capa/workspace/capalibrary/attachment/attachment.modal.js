"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AttachmentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileKey: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        enum: ["image/jpeg", "image/png", "application/pdf"],
        required: true,
    },
    library: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Capaworkspace',
        required: true,
    },
    size: {
        type: Number,
        min: 0,
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
const AttachmentModal = mongoose_1.default.model('Attachment', AttachmentSchema);
exports.default = AttachmentModal;

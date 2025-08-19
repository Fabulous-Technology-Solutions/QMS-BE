"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ActivityLogSchema = new mongoose_1.default.Schema({
    changes: { type: Object, required: true },
    performedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    documentId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, refPath: 'collectionName' },
    collectionName: { type: String, required: true },
    logof: { type: mongoose_1.default.Schema.Types.ObjectId },
    message: { type: String, default: null },
    action: { type: String, enum: ['post', 'put', 'delete', 'get', 'patch', 'restore'], required: true },
}, {
    timestamps: true,
    versionKey: false,
});
ActivityLogSchema.index({ documentId: 1, collectionName: 1 });
const ActivityLog = mongoose_1.default.model('ActivityLog', ActivityLogSchema);
exports.default = ActivityLog;

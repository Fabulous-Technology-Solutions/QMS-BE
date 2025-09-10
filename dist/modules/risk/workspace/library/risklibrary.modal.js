"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LibrarySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    managers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    category: {
        type: String,
        enum: ['Financial', 'Operational', 'Strategic', 'Compliance', 'Reputational'],
        required: true
    },
    dateIdentified: { type: Date, default: null },
    site: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Site'
    },
    process: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Process'
    },
    riskappetite: {
        type: Number,
        min: 1,
        max: 25,
        default: null
    },
    assessmentApproval: {
        status: { type: String, enum: ['Reviewed', 'Approved', 'Draft'], default: 'Draft' },
        feedback: { type: String, default: '' },
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.LibraryModel = mongoose_1.default.model('RiskLibrary', LibrarySchema);

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
    containment: {
        responsibles: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        description: {
            type: String,
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    Form5W2H: {
        what: { type: String, default: null },
        why: { type: String, default: null },
        when: { type: String, default: null },
        where: { type: String, default: null },
        who: { type: String, default: null },
        how: { type: String, default: null },
        howImpacted: {
            type: String,
            default: null,
        }
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.LibraryModel = mongoose_1.default.model('RiskLibrary', LibrarySchema);

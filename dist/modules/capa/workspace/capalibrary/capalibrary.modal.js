"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryModel = void 0;
const action_modal_1 = __importDefault(require("./action/action.modal"));
const mongoose_1 = __importDefault(require("mongoose"));
const causes_modal_1 = __importDefault(require("./causes/causes.modal"));
const checklisthistory_modal_1 = __importDefault(require("./checklisthistory/checklisthistory.modal"));
const attachment_modal_1 = __importDefault(require("./attachment/attachment.modal"));
const upload_middleware_1 = require("../../../upload/upload.middleware");
const LibrarySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    status: { type: String, enum: ['pending', 'completed', 'in-progress'], default: 'pending' },
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account' }],
    managers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account' }],
    site: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Site'
        }],
    processdata: {
        process: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Process'
        },
        subProcess: [{ type: String }]
    },
    endDate: { type: Date, default: null },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    containment: {
        responsibles: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Account',
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
LibrarySchema.pre('findOneAndDelete', async function (next) {
    const libraryId = this.getQuery()['_id'];
    const actions = await action_modal_1.default.find({ library: libraryId });
    const attachments = await attachment_modal_1.default.find({ library: libraryId });
    const history = await checklisthistory_modal_1.default.find({ library: libraryId });
    history?.forEach(async (item) => {
        item?.list?.forEach(async (listItem) => {
            if (listItem?.evidenceKey) {
                await (0, upload_middleware_1.deleteMedia)(listItem?.evidenceKey);
            }
        });
    });
    actions?.forEach(async (action) => {
        if (action.docfileKey) {
            await (0, upload_middleware_1.deleteMedia)(action.docfileKey);
        }
    });
    attachments?.forEach(async (attachment) => {
        if (attachment.fileKey) {
            await (0, upload_middleware_1.deleteMedia)(attachment.fileKey);
        }
    });
    // Delete related documents in other collections
    await action_modal_1.default.deleteMany({ library: libraryId });
    await causes_modal_1.default.deleteMany({ library: libraryId });
    await checklisthistory_modal_1.default.deleteMany({ library: libraryId });
    await attachment_modal_1.default.deleteMany({ library: libraryId });
    next();
});
exports.LibraryModel = mongoose_1.default.model('Library', LibrarySchema);

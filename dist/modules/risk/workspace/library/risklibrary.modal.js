"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryModel = void 0;
const upload_middleware_1 = require("../../../upload/upload.middleware");
const action_modal_1 = __importDefault(require("./action/action.modal"));
const attachment_modal_1 = __importDefault(require("./attachment/attachment.modal"));
const mongoose_1 = __importDefault(require("mongoose"));
const causes_modal_1 = __importDefault(require("./causes/causes.modal"));
const fivewhys_modal_1 = __importDefault(require("./fivewhys/fivewhys.modal"));
const Ishikawa_modal_1 = __importDefault(require("./Ishikawa/Ishikawa.modal"));
const control_modal_1 = __importDefault(require("./control/control.modal"));
const consequence_modal_1 = __importDefault(require("./consequence/consequence.modal"));
const assessment_modal_1 = __importDefault(require("./assessment/assessment.modal"));
const LibrarySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    status: { type: String, enum: ['pending', 'completed', 'in-progress'], default: 'pending' },
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
LibrarySchema.pre('findOneAndDelete', async function (next) {
    const libraryId = this.getQuery()['_id'];
    const actions = await action_modal_1.default.find({ library: libraryId });
    const attachments = await attachment_modal_1.default.find({ library: libraryId });
    const assessments = await assessment_modal_1.default.find({ library: libraryId });
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
    assessments?.forEach(async (assessment) => {
        if (assessment.templateKey) {
            await (0, upload_middleware_1.deleteMedia)(assessment.templateKey);
        }
    });
    // Delete related documents in other collections
    await action_modal_1.default.deleteMany({ library: libraryId });
    await fivewhys_modal_1.default.deleteMany({ library: libraryId });
    await Ishikawa_modal_1.default.deleteMany({ library: libraryId });
    await causes_modal_1.default.deleteMany({ library: libraryId });
    await attachment_modal_1.default.deleteMany({ library: libraryId });
    await control_modal_1.default.deleteMany({ library: libraryId });
    await consequence_modal_1.default.deleteMany({ library: libraryId });
    await assessment_modal_1.default.deleteMany({ library: libraryId });
    next();
});
exports.LibraryModel = mongoose_1.default.model('RiskLibrary', LibrarySchema);

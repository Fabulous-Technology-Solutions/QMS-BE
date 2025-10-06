"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AssessmentSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    evaluator: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account', required: true },
    probability: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    impact: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    status: { type: String, enum: ['draft', 'reviewed', 'approved', 'rejected', 'pending'], default: 'draft' },
    approval: {
        type: Boolean,
        default: false
    },
    template: { type: String },
    templateKey: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const AssessmentModel = mongoose_1.default.model('Assessment', AssessmentSchema);
exports.default = AssessmentModel;

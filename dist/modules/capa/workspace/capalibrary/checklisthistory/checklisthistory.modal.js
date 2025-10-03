"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChecklistHistorySchema = new mongoose_1.default.Schema({
    checklistId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Checklist', required: true },
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Library', required: true },
    comment: { type: String, required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    list: [
        {
            item: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'CheckListItem', required: true },
            yes: { type: Boolean, required: true },
            no: { type: Boolean, required: true },
            partial: { type: Boolean, required: true },
            evidence: { type: String },
            evidenceKey: { type: String },
            comment: { type: String },
        },
    ],
}, { timestamps: true });
const ChecklistHistory = mongoose_1.default.model('ChecklistHistory', ChecklistHistorySchema);
exports.default = ChecklistHistory;

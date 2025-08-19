"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    schedule: { type: Boolean, default: false },
    scheduleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    scheduleEmails: { type: [String] },
    nextSchedule: { type: Date },
    lastSchedule: { type: Date },
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Library', required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Capaworkspace', required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const ReportModel = mongoose_1.default.model('Report', reportSchema);
exports.default = ReportModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportHistorySchema = new mongoose_1.default.Schema({
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Library" },
    file: { type: String, required: true },
    fileKey: { type: String, required: true }
}, {
    timestamps: true
});
const ReportHistoryModel = mongoose_1.default.model("ReportHistory", reportHistorySchema);
exports.default = ReportHistoryModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const checklistSchema = new mongoose_1.default.Schema({
    name: { type: String },
    description: { type: String },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Workspace", required: true },
    isDelete: { type: Boolean, default: false },
});
const Checklist = mongoose_1.default.model("Checklist", checklistSchema);
exports.default = Checklist;

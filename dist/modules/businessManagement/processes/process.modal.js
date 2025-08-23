"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const processSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, maxlength: 100 },
    location: { type: String, required: true, maxlength: 100 },
    parentSite: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Site" },
    processCode: { type: String, required: true, maxlength: 100 },
    note: { type: String, required: true, maxlength: 500 },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
    modules: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Subscription" }],
    subProcesses: [{ type: String }],
    status: { type: Boolean, default: true },
    acrossMultipleSites: { type: Boolean, default: false },
});
const ProcessModel = mongoose_1.default.model("Process", processSchema);
exports.default = ProcessModel;

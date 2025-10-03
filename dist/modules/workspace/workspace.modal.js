"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CapaworkspaceSchema = new mongoose_1.default.Schema({
    moduleId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Subscription' },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    imageUrl: { type: String },
    imagekey: { type: String },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
const CapaworkspaceModel = mongoose_1.default.model('Workspace', CapaworkspaceSchema);
exports.default = CapaworkspaceModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoleSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    permissions: { type: String, enum: ['view', 'edit', 'admin'] },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    process: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Process' },
    site: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Site' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});
const RoleModel = mongoose_1.default.model('Role', RoleSchema);
exports.default = RoleModel;

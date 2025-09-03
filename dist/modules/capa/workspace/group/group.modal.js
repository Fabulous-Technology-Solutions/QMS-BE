"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});
const GroupModel = mongoose_1.default.model('Group', GroupSchema);
exports.default = GroupModel;

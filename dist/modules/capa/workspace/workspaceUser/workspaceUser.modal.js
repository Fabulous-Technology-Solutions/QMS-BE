"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../../user/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    workspace: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    roleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
}, {
    timestamps: true,
});
const workspaceUser = user_model_1.default.discriminator('workspaceUser', userSchema);
exports.default = workspaceUser;

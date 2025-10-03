"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invitationValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const invitationBodySchema = {
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string().valid('admin', 'workspaceUser', 'standardUser').required(),
    Permissions: joi_1.default.array()
        .items(joi_1.default.object({
        permission: joi_1.default.string().default('view').valid('admin', 'view', 'edit'),
        workspace: joi_1.default.string().required(),
    }))
        .optional(),
    status: joi_1.default.string().valid('pending', 'accepted').default('pending'),
    token: joi_1.default.string(),
    invitedBy: joi_1.default.string(),
    accountId: joi_1.default.string().optional(),
};
exports.invitationValidationSchema = { body: joi_1.default.object()
        .keys(invitationBodySchema)
        .fork(['email', 'role', 'accountId'], (schema) => schema.required()) };

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccountValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const accountBodySchema = {
    role: joi_1.default.string().valid('admin', 'workspaceUser', 'standardUser').required(),
    workspaceRole: joi_1.default.string().valid('admin', 'view', 'edit').optional(),
    Permissions: joi_1.default.array()
        .items(joi_1.default.object({
        permission: joi_1.default.string().required(),
        workspace: joi_1.default.string().required(),
    }))
        .optional(),
    accountId: joi_1.default.string(),
    user: joi_1.default.string(),
    status: joi_1.default.string().valid('active', 'inactive'),
};
exports.updateAccountValidationSchema = { body: joi_1.default.object().keys(accountBodySchema).min(1) };

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = exports.createRole = void 0;
const joi_1 = __importDefault(require("joi"));
const roleBody = {
    name: joi_1.default.string().min(2).max(100).messages({
        'string.empty': 'Name is required',
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters'
    }),
    description: joi_1.default.string().min(5).max(500).messages({
        'string.empty': 'Description is required',
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 5 characters long',
        'string.max': 'Description must not exceed 500 characters'
    }),
    permissions: joi_1.default.valid('view', 'edit', 'w_admin').messages({
        'any.only': 'Permissions must be one of [view, edit, w_admin]'
    }),
    workspace: joi_1.default.string().messages({
        'string.empty': 'Workspace is required',
        'string.base': 'Workspace must be a string'
    })
};
exports.createRole = {
    body: joi_1.default.object().keys(roleBody).fork(['name', 'description', 'permissions', 'workspace'], (schema) => schema.required()),
};
exports.updateRole = {
    body: joi_1.default.object().keys(roleBody).min(1)
};

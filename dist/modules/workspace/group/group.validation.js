"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroupValidationSchema = exports.groupValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const groupBody = {
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
    workspace: joi_1.default.string().messages({
        'string.empty': 'Workspace is required',
        'string.base': 'Workspace must be a string'
    }),
    members: joi_1.default.array().items(joi_1.default.string()).messages({
        'array.base': 'Members must be an array of strings',
        'string.base': 'Each member must be a string'
    }),
    status: joi_1.default.string().valid('active', 'inactive').messages({
        'any.only': 'Status must be one of [active, inactive]'
    }),
    createdBy: joi_1.default.string().messages({
        'string.empty': 'CreatedBy is required',
        'string.base': 'CreatedBy must be a string'
    })
};
exports.groupValidationSchema = joi_1.default.object().keys(groupBody).fork(['name', 'description', 'workspace', "members", "status"], (schema) => schema.required());
exports.updateGroupValidationSchema = joi_1.default.object().keys(groupBody).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

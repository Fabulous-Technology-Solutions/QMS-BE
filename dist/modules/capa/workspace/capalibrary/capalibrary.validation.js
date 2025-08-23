"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLibraryValidationSchema = exports.libraryValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const libraryBody = {
    name: joi_1.default.string().min(2).max(100).messages({
        "string.base": `"name" should be a type of 'text'`,
        "string.empty": `"name" cannot be an empty field`,
        "string.min": `"name" should have a minimum length of {#limit}`,
        "string.max": `"name" should have a maximum length of {#limit}`,
        "any.required": `"name" is a required field`
    }),
    description: joi_1.default.string().min(2).max(500).messages({
        "string.base": `"description" should be a type of 'text'`,
        "string.empty": `"description" cannot be an empty field`,
        "string.min": `"description" should have a minimum length of {#limit}`,
        "string.max": `"description" should have a maximum length of {#limit}`,
        "any.required": `"description" is a required field`
    }),
    site: joi_1.default.string().messages({
        "string.base": `"site" should be a type of 'text'`,
        "string.empty": `"site" cannot be an empty field`,
        "any.required": `"site" is a required field`
    }),
    process: joi_1.default.string().messages({
        "string.base": `"process" should be a type of 'text'`,
        "string.empty": `"process" cannot be an empty field`,
        "any.required": `"process" is a required field`
    }),
    workspace: joi_1.default.string().messages({
        "string.base": `"workspace" should be a type of 'text'`,
        "string.empty": `"workspace" cannot be an empty field`,
        "any.required": `"workspace" is a required field`
    }),
    createdBy: joi_1.default.string().messages({
        "string.base": `"createdBy" should be a type of 'text'`,
        "string.empty": `"createdBy" cannot be an empty field`,
        "any.required": `"createdBy" is a required field`
    }),
    status: joi_1.default.string().valid("pending", "completed", "in-progress").messages({
        "string.base": `"status" should be a type of 'text'`,
        "any.required": `"status" is a required field`
    }),
    members: joi_1.default.array().items(joi_1.default.string()).optional().messages({
        "array.base": `"members" should be an array of 'text'`,
    }),
    managers: joi_1.default.array().items(joi_1.default.string()).optional().messages({
        "array.base": `"managers" should be an array of 'text'`,
    }),
    priority: joi_1.default.string().valid("low", "medium", "high").messages({
        "string.base": `"priority" should be a type of 'text'`,
        "any.required": `"priority" is a required field`
    }),
    Form5W2H: joi_1.default.object({
        what: joi_1.default.string().allow(null, '').optional(),
        why: joi_1.default.string().allow(null, '').optional(),
        when: joi_1.default.string().allow(null, '').optional(),
        where: joi_1.default.string().allow(null, '').optional(),
        who: joi_1.default.string().allow(null, '').optional(),
        how: joi_1.default.string().allow(null, '').optional(),
        howImpacted: joi_1.default.string().allow(null, '').optional(),
    }).optional(),
    containment: joi_1.default.object({
        status: joi_1.default.boolean().optional(),
        description: joi_1.default.string().allow(null, '').optional(),
        dueDate: joi_1.default.date().optional(),
    }).optional(),
};
exports.libraryValidationSchema = { body: joi_1.default.object().keys(libraryBody).fork(['name', 'description', 'workspace', 'priority'], (schema) => schema.required()) };
exports.updateLibraryValidationSchema = {
    body: joi_1.default.object().keys(libraryBody).min(1).messages({
        "object.min": "At least one field must be provided for update"
    })
};

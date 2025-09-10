"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssessmentSchema = exports.createAssessmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const createAssessmentBody = {
    name: joi_1.default.string().min(3).max(100).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 100 characters long',
    }),
    library: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
        'string.base': 'Library ID must be a string',
        'string.pattern.base': 'Library ID must be a valid ObjectId',
    }),
    createdBy: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
        'string.base': 'CreatedBy ID must be a string',
        'string.pattern.base': 'CreatedBy ID must be a valid ObjectId',
    }),
    evaluator: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
        'string.base': 'Evaluator ID must be a string',
        'string.pattern.base': 'Evaluator ID must be a valid ObjectId',
    }),
    template: joi_1.default.string().uri().messages({
        'string.base': 'Template must be a string',
        'string.uri': 'Template must be a valid URI',
    }),
    templateKey: joi_1.default.string().messages({
        'string.base': 'TemplateKey must be a string',
    }),
    severity: joi_1.default.string().valid('low', 'medium', 'high', 'low-medium', 'high-medium').messages({
        'string.base': 'Severity must be a string',
    }),
    probability: joi_1.default.string().valid('high-unlikely', 'low-unlikely', 'likely', 'possible', 'high-likely').messages({
        'string.base': 'Probability must be a string',
    }),
    impact: joi_1.default.string().valid('not-significant', 'minor', 'moderate', 'major', 'severe').messages({
        'string.base': 'Impact must be a string',
    }),
    status: joi_1.default.string().valid('draft', 'reviewed', 'approved', 'rejected', 'pending').messages({
        'string.base': 'Status must be a string',
    }),
    approval: joi_1.default.boolean().messages({
        'boolean.base': 'Approval must be a boolean',
    }),
};
const createAssessmentSchema = joi_1.default.object().keys(createAssessmentBody).fork(['name', 'library', 'createdBy', 'evaluator', 'template', 'templateKey', 'severity', 'probability', 'impact'], (schema) => schema.required());
exports.createAssessmentSchema = createAssessmentSchema;
const updateAssessmentSchema = joi_1.default.object().keys(createAssessmentBody);
exports.updateAssessmentSchema = updateAssessmentSchema;

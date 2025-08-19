"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAction = exports.createAction = void 0;
const joi_1 = __importDefault(require("joi"));
const createActionBody = {
    name: joi_1.default.string().min(3).max(100).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 100 characters long',
    }),
    description: joi_1.default.string().min(10).max(500).messages({
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description must be at most 500 characters long',
    }),
    createdBy: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.base': 'CreatedBy ID must be a string',
        'string.pattern.base': 'CreatedBy ID must be a valid ObjectId',
    }),
    status: joi_1.default.string().valid('pending', 'in-progress', 'completed', 'on-hold').messages({
        'string.base': 'Status must be a string',
    }),
    assignedTo: joi_1.default.array().items(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.base': 'AssignedTo ID must be a string',
        'string.pattern.base': 'AssignedTo ID must be a valid ObjectId',
    })).optional(),
    priority: joi_1.default.string().valid('low', 'medium', 'high'),
    type: joi_1.default.string().valid('preventive', 'corrective'),
    endDate: joi_1.default.date(),
    startDate: joi_1.default.date(),
    library: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.base': 'library ID must be a string',
        'string.pattern.base': 'library ID must be a valid ObjectId',
    }),
    docfile: joi_1.default.string().uri().messages({
        'string.base': 'Docfile must be a string',
        'string.uri': 'Docfile must be a valid URI',
    }),
    docfileKey: joi_1.default.string().messages({
        'string.base': 'DocfileKey must be a string',
    }),
    cause: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
        'string.base': 'Cause ID must be a string',
        'string.pattern.base': 'Cause ID must be a valid ObjectId',
    }),
};
exports.createAction = {
    body: joi_1.default.object().keys(createActionBody).fork(['name', 'description', 'library', 'startDate', 'endDate', 'type', 'priority'], (schema) => schema.required()),
};
exports.updateAction = {
    body: joi_1.default.object().keys(createActionBody),
};

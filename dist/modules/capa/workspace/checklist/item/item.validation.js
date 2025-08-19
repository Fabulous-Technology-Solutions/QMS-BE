"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItemsArraySchema = exports.UpdateItem = exports.CreateItemsArraySchema = exports.CreateItem = void 0;
const joi_1 = __importDefault(require("joi"));
const checklistitemBody = {
    question: joi_1.default.string().min(2).max(100),
    checklist: joi_1.default.string().length(24),
};
exports.CreateItem = joi_1.default.object()
    .keys({
    ...checklistitemBody,
})
    .fork(['checklist', 'question'], (schema) => schema.required().messages({
    'any.required': 'This field is required',
}));
exports.CreateItemsArraySchema = joi_1.default.array().items(exports.CreateItem).min(1).messages({
    'array.min': 'At least one checklist item must be provided',
    'array.base': 'Checklist items must be an array',
});
exports.UpdateItem = joi_1.default.object()
    .keys({
    ...checklistitemBody,
})
    .min(1)
    .messages({
    'object.min': 'At least one field must be provided for update',
});
exports.UpdateItemsArraySchema = joi_1.default.array().items(exports.UpdateItem).min(1).messages({
    'array.min': 'At least one checklist item must be provided for update',
    'array.base': 'Checklist items must be an array',
});

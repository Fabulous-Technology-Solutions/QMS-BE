"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCausesSchema = exports.createCausesSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const causesBody = {
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    library: joi_1.default.string().required(),
    fileUrl: joi_1.default.string().uri().optional(),
    fileKey: joi_1.default.string().optional()
};
exports.createCausesSchema = joi_1.default.object().keys(causesBody).fork(['name', 'description', 'library'], (schema) => schema.required());
exports.updateCausesSchema = joi_1.default.object().keys(causesBody).min(1).messages({
    "object.min": "At least one field must be provided for update"
});

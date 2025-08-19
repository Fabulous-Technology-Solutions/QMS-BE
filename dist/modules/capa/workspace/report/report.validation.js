"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportSchema = exports.createReportSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const reportSchemaBody = {
    name: joi_1.default.string().required(),
    schedule: joi_1.default.boolean(),
    scheduleFrequency: joi_1.default.string().valid('daily', 'weekly', 'monthly'),
    scheduleEmails: joi_1.default.array().items(joi_1.default.string().email()),
    createdBy: joi_1.default.string(),
    workspace: joi_1.default.string(),
    isDeleted: joi_1.default.boolean().default(false),
    library: joi_1.default.string().required()
};
exports.createReportSchema = joi_1.default.object().keys(reportSchemaBody).fork(['name', 'workspace', 'library'], (schema) => schema.required());
exports.updateReportSchema = joi_1.default.object().keys(reportSchemaBody).min(1);

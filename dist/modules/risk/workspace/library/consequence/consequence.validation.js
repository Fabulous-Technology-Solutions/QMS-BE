"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsequenceValidationSchema = exports.createConsequenceValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ConsequenceBody = {
    library: joi_1.default.string(),
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    createdBy: joi_1.default.string(),
};
exports.createConsequenceValidationSchema = joi_1.default.object().keys(ConsequenceBody).fork(['library', 'name', 'description'], (schema) => schema.required());
exports.updateConsequenceValidationSchema = joi_1.default.object().keys(ConsequenceBody).fork(['library', 'name', 'description'], (schema) => schema.optional());

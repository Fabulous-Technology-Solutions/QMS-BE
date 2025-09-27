"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkListUpdateValidationSchema = exports.checkListValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const checkListBody = {
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    workspace: joi_1.default.string().required()
};
exports.checkListValidationSchema = { body: joi_1.default.object().keys(checkListBody).fork(['name', 'description', 'workspace'], (schema) => schema.required()) };
exports.checkListUpdateValidationSchema = { body: joi_1.default.object().keys(checkListBody).min(1) };

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRisk = exports.createRisk = void 0;
const joi_1 = __importDefault(require("joi"));
const RiskworkspaceBody = {
    moduleId: joi_1.default.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).optional(),
    name: joi_1.default.string().min(2).max(100).optional(),
    imageUrl: joi_1.default.string().uri().optional(),
    imagekey: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
};
exports.createRisk = {
    body: joi_1.default.object().keys(RiskworkspaceBody).fork(['moduleId', "name", "imageUrl", "imagekey", "description"], (schema) => schema.required()),
};
exports.updateRisk = {
    body: joi_1.default.object().keys(RiskworkspaceBody).min(1),
};

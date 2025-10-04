"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCapa = exports.createCapa = void 0;
const joi_1 = __importDefault(require("joi"));
const capaworkspaceBody = {
    moduleId: joi_1.default.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).optional(),
    name: joi_1.default.string().min(2).max(100).optional(),
    imageUrl: joi_1.default.string().uri().optional(),
    imagekey: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
};
exports.createCapa = {
    body: joi_1.default.object().keys(capaworkspaceBody).fork(['moduleId', "description"], (schema) => schema.required()),
};
exports.updateCapa = {
    body: joi_1.default.object().keys(capaworkspaceBody).min(1),
};

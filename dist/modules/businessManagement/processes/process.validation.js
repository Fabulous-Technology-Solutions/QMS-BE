"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProcessSchema = exports.createProcessSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const processBody = {
    name: joi_1.default.string().max(100),
    location: joi_1.default.string().max(100),
    parentSite: joi_1.default.string(),
    processCode: joi_1.default.string().max(100),
    note: joi_1.default.string().max(500),
    createdBy: joi_1.default.string(),
    modules: joi_1.default.array().items(joi_1.default.string()).optional(),
    status: joi_1.default.boolean().optional(),
    acrossMultipleSites: joi_1.default.boolean().optional(),
};
exports.createProcessSchema = joi_1.default.object().keys(processBody).fork(["name", "location", "parentSite", "note"], (schema) => schema.required());
exports.updateProcessSchema = joi_1.default.object().keys(processBody).min(1);

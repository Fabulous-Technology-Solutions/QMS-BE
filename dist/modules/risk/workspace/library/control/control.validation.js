"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateControlSchema = exports.createControlSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const createControlBody = {
    library: joi_1.default.string(),
    description: joi_1.default.string(),
    controlType: joi_1.default.string(),
    effectiveness: joi_1.default.string(),
    owners: joi_1.default.array().items(joi_1.default.string().required()),
    name: joi_1.default.string()
};
exports.createControlSchema = joi_1.default.object().keys(createControlBody).fork(['library', 'name', 'description', 'effectiveness', 'owners'], (schema) => schema.required());
exports.updateControlSchema = joi_1.default.object().keys(createControlBody);

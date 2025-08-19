"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIshikawaSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const IshikawaBody = {
    library: joi_1.default.string().required(),
    createdBy: joi_1.default.string(),
    problems: joi_1.default.array()
        .items(joi_1.default.object({
        problem: joi_1.default.string().required(),
        category: joi_1.default.array()
            .items(joi_1.default.object({
            name: joi_1.default.string().required(),
            cause: joi_1.default.array()
                .items(joi_1.default.object({
                name: joi_1.default.string().required(),
                subCauses: joi_1.default.array().items(joi_1.default.string()),
            }))
                .required(),
        }))
            .required(),
    }))
        .required(),
};
exports.CreateIshikawaSchema = joi_1.default.object().keys(IshikawaBody);

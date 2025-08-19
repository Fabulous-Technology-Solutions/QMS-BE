"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFiveWhysRequestSchema = exports.CreateFiveWhysRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const FiveWhyBody = {
    library: joi_1.default.string().length(24),
    problem: joi_1.default.string().max(500),
    createdBy: joi_1.default.string().length(24).messages({
        "string.base": `"createdBy" should be a type of 'text'`,
        "string.empty": `"createdBy" cannot be an empty field`,
        "string.length": `"createdBy" must be exactly 24 characters long`
    }),
    list: joi_1.default.array().items(joi_1.default.object({
        question: joi_1.default.string().max(200).required().messages({
            "string.base": `"question" should be a type of 'text'`,
        }),
        answer: joi_1.default.string().max(500).required().messages({
            "string.base": `"answer" should be a type of 'text'`,
        }),
    })).min(1).max(5).messages({
        "array.min": "At least one question-answer pair is required",
        "array.max": "A maximum of five question-answer pairs are allowed",
    })
};
exports.CreateFiveWhysRequestSchema = joi_1.default.object().keys(FiveWhyBody).fork(['library', 'problem', 'list'], (schema) => schema.required());
exports.UpdateFiveWhysRequestSchema = joi_1.default.object().keys(FiveWhyBody).min(1);

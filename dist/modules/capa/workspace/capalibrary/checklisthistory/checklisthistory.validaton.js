"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChecklistHistoryValidation = exports.createChecklistHistoryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const historyBody = {
    checklistId: joi_1.default.string().required(),
    library: joi_1.default.string().required(),
    comment: joi_1.default.string().required(),
    createdBy: joi_1.default.string(),
    list: joi_1.default.array()
        .items(joi_1.default.object({
        item: joi_1.default.string().required(),
        yes: joi_1.default.boolean().required(),
        no: joi_1.default.boolean().required(),
        partial: joi_1.default.boolean().required(),
        evidence: joi_1.default.string().uri(),
        evidenceKey: joi_1.default.string(),
        comment: joi_1.default.string().min(2).max(100),
    }))
        .required(),
};
exports.createChecklistHistoryValidation = { body: joi_1.default.object()
        .keys(historyBody)
        .fork(['checklistId', 'library', 'list'], (field) => field.required()) };
exports.updateChecklistHistoryValidation = { body: joi_1.default.object().keys(historyBody).min(1) };

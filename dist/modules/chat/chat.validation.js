"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChat = void 0;
const joi_1 = __importDefault(require("joi"));
const createChatBody = {
    obj: joi_1.default.string().required(),
    chatOf: joi_1.default.string().required(),
    participants: joi_1.default.array().items(joi_1.default.string().required()).required()
};
exports.createChat = joi_1.default.object().keys(createChatBody);

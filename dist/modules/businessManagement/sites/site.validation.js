"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSiteSchema = exports.createSiteSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const SiteBody = {
    name: joi_1.default.string().max(100).required(),
    location: joi_1.default.string().max(100).required(),
    timeZone: joi_1.default.string().max(100).required(),
    siteCode: joi_1.default.string().max(100),
    note: joi_1.default.string().max(500).required(),
    createdBy: joi_1.default.string(),
    modules: joi_1.default.array().items(joi_1.default.string()).optional(),
    status: joi_1.default.boolean().optional(),
};
exports.createSiteSchema = joi_1.default.object().keys(SiteBody).fork(["name", "location", "timeZone", "note"], (schema) => schema.required());
exports.updateSiteSchema = joi_1.default.object().keys(SiteBody).min(1);

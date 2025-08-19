"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspaceUser = exports.createWorkspaceUser = void 0;
const joi_1 = __importDefault(require("joi"));
const createbody = {
    workspace: joi_1.default.string().messages({
        'string.empty': 'Workspace ID is required',
    }),
    roleId: joi_1.default.string().messages({
        'string.empty': 'Role ID is required',
    }),
    name: joi_1.default.string().messages({
        'string.empty': 'Name is required',
    }),
    email: joi_1.default.string().email().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email',
    }),
    status: joi_1.default.string().valid('active', 'inactive').messages({
        'string.empty': 'Status is required',
        'any.only': 'Status must be either active or inactive',
    }),
    profilePicture: joi_1.default.string().uri().optional().messages({
        'string.uri': 'Profile picture must be a valid URI',
    }),
    profilePictureKey: joi_1.default.string().optional().messages({
        'string.empty': 'Profile picture key is required',
    }),
};
exports.createWorkspaceUser = {
    body: joi_1.default.object().keys(createbody).fork(['workspace', 'roleId', 'name', 'email', 'status'], (schema) => schema.required()),
};
exports.updateWorkspaceUser = {
    params: joi_1.default.object().keys(createbody).min(1)
};

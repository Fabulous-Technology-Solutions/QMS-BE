"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentValidation = exports.AttachmentService = exports.AttachmentController = exports.Attachment = void 0;
const Attachment = __importStar(require("./attachment.modal"));
exports.Attachment = Attachment;
const AttachmentController = __importStar(require("./attachment.controller"));
exports.AttachmentController = AttachmentController;
const AttachmentService = __importStar(require("./attachment.services"));
exports.AttachmentService = AttachmentService;
const AttachmentValidation = __importStar(require("./attachment.validation"));
exports.AttachmentValidation = AttachmentValidation;

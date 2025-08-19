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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachmentsByWorkspace = exports.getAttachmentById = exports.deleteAttachment = exports.updateAttachment = exports.createAttachment = void 0;
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const AttachmentService = __importStar(require("./attachment.services"));
exports.createAttachment = (0, catchAsync_1.default)(async (req, res) => {
    const attachment = await AttachmentService.createAttachment(req.body);
    res.locals["message"] = "create attachment";
    res.locals["documentId"] = attachment._id;
    res.locals["collectionName"] = "Attachment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = attachment;
    res.status(201).json(attachment);
});
exports.updateAttachment = (0, catchAsync_1.default)(async (req, res) => {
    const { attachmentId } = req.params;
    const updatedAttachment = await AttachmentService.updateAttachment(attachmentId || "", req.body);
    res.locals["message"] = "update attachment";
    res.locals["documentId"] = updatedAttachment._id;
    res.locals["collectionName"] = "Attachment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = updatedAttachment;
    res.status(200).json(updatedAttachment);
});
exports.deleteAttachment = (0, catchAsync_1.default)(async (req, res) => {
    const { attachmentId } = req.params;
    const deletedAttachment = await AttachmentService.deleteAttachment(attachmentId);
    res.locals["message"] = "delete attachment";
    res.locals["documentId"] = deletedAttachment._id;
    res.locals["collectionName"] = "Attachment";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.body.library || req.params['libraryId'] ||
        res.status(200).json(deletedAttachment);
});
exports.getAttachmentById = (0, catchAsync_1.default)(async (req, res) => {
    const { attachmentId } = req.params;
    const attachment = await AttachmentService.getAttachmentById(attachmentId);
    res.status(200).json(attachment);
});
exports.getAttachmentsByWorkspace = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;
    const attachments = await AttachmentService.getAttachmentsByLibrary(libraryId || "", Number(page || 1), Number(limit || 10), search);
    res.status(200).json(attachments);
});

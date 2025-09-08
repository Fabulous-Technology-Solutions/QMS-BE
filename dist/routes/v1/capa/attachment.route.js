"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attachment_1 = require("../../../modules/capa/workspace/capalibrary/attachment");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const capalibrary_middleware_1 = __importDefault(require("../../../modules/capa/workspace/capalibrary/capalibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("createAttachment"), capalibrary_middleware_1.default, (0, validate_1.validate)(attachment_1.AttachmentValidation.createAttachmentSchema), activitylogs_middleware_1.activityLoggerMiddleware, attachment_1.AttachmentController.create);
router.patch("/libraries/:libraryId/attachment/:attachmentId", (0, auth_1.auth)("updateAttachment"), capalibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, (0, validate_1.validate)(attachment_1.AttachmentValidation.updateAttachmentSchema), attachment_1.AttachmentController.update);
router.delete("/libraries/:libraryId/attachment/:attachmentId", (0, auth_1.auth)("deleteAttachment"), capalibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, attachment_1.AttachmentController.delete);
router.get("/libraries/:libraryId/attachment/:attachmentId", (0, auth_1.auth)("getAttachmentById"), capalibrary_middleware_1.default, attachment_1.AttachmentController.getById);
router.get("/libraries/:libraryId/attachments", (0, auth_1.auth)("getAttachmentsByWorkspace"), capalibrary_middleware_1.default, attachment_1.AttachmentController.getByLibrary);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attachment_1 = require("../../../modules/risk/workspace/library/attachment");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.auth)("Risk_createAttachment"), risklibrary_middleware_1.default, (0, validate_1.validate)(attachment_1.AttachmentValidation.createAttachmentSchema), activitylogs_middleware_1.activityLoggerMiddleware, attachment_1.AttachmentController.create);
router.patch("/libraries/:libraryId/attachment/:attachmentId", (0, auth_1.auth)("Risk_updateAttachment"), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, (0, validate_1.validate)(attachment_1.AttachmentValidation.updateAttachmentSchema), attachment_1.AttachmentController.update);
router.delete("/libraries/:libraryId/attachment/:attachmentId", (0, auth_1.auth)("Risk_deleteAttachment"), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, attachment_1.AttachmentController.delete);
router.get("/libraries/:libraryId/attachment/:attachmentId", (0, auth_1.auth)("Risk_getAttachmentById"), risklibrary_middleware_1.default, attachment_1.AttachmentController.getById);
router.get("/libraries/:libraryId/attachments", (0, auth_1.auth)("Risk_getAttachmentsByLibrary"), risklibrary_middleware_1.default, attachment_1.AttachmentController.getByLibrary);
exports.default = router;

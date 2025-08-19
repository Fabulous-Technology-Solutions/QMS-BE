"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("../../modules/capa/workspace/checklist/item");
const express_1 = require("express");
const auth_1 = require("../../modules/auth");
const mangeRole_middleware_1 = __importDefault(require("../../modules/capa/workspace/mangeRole.middleware"));
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createChecklistItem'), item_1.itemController.createChecklistItem);
router
    .route('/workspace/:workspaceId/items/:itemId')
    .delete((0, auth_1.auth)('deleteChecklistItem'), mangeRole_middleware_1.default, item_1.itemController.deleteChecklistItem);
router
    .route('/workspace/:workspaceId/items').patch((0, auth_1.auth)('updateChecklistItem'), mangeRole_middleware_1.default, item_1.itemController.updateChecklistItem);
router
    .route('/workspace/:workspaceId/checklist/:checklistId/items')
    .get((0, auth_1.auth)('getChecklistItems'), mangeRole_middleware_1.default, item_1.itemController.getChecklistItemsByChecklistId);
exports.default = router;

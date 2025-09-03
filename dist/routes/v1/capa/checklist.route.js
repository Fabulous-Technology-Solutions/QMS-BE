"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checklist_1 = require("../../../modules/capa/workspace/checklist");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const mangeRole_middleware_1 = __importDefault(require("../../../modules/workspace/mangeRole.middleware"));
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createChecklist'), mangeRole_middleware_1.default, (0, validate_1.validate)(checklist_1.ValidationChecklist.checkListValidationSchema), checklist_1.ChecklistController.createChecklist);
router
    .route('/workspace/:workspaceId/checklist/:checklistId')
    .get((0, auth_1.auth)('getChecklist'), mangeRole_middleware_1.default, checklist_1.ChecklistController.getChecklistById)
    .patch((0, auth_1.auth)('updateChecklist'), mangeRole_middleware_1.default, (0, validate_1.validate)(checklist_1.ValidationChecklist.checkListUpdateValidationSchema), checklist_1.ChecklistController.updateChecklist)
    .delete((0, auth_1.auth)('deleteChecklist'), mangeRole_middleware_1.default, checklist_1.ChecklistController.deleteChecklist);
router
    .route('/workspace/:workspaceId')
    .get((0, auth_1.auth)('getChecklists'), mangeRole_middleware_1.default, checklist_1.ChecklistController.getChecklistsByWorkspaceId);
router
    .route('/workspace/:workspaceId/names')
    .get((0, auth_1.auth)('getChecklistNames'), mangeRole_middleware_1.default, checklist_1.ChecklistController.getChecklistNames);
exports.default = router;

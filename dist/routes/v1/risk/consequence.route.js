"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consequence_1 = require("../../../modules/risk/workspace/library/consequence");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createConsequence'), risklibrary_middleware_1.default, (0, validate_1.validate)(consequence_1.ConsequenceValidation.createConsequenceValidationSchema), activitylogs_middleware_1.activityLoggerMiddleware, consequence_1.ConsequenceController.createConsequence);
router
    .route('/libraries/:libraryId/consequence/:id')
    .get((0, auth_1.auth)('getConsequence'), risklibrary_middleware_1.default, consequence_1.ConsequenceController.getConsequence)
    .patch((0, auth_1.auth)('updateConsequence'), risklibrary_middleware_1.default, (0, validate_1.validate)(consequence_1.ConsequenceValidation.updateConsequenceValidationSchema), activitylogs_middleware_1.activityLoggerMiddleware, consequence_1.ConsequenceController.updateConsequence)
    .delete((0, auth_1.auth)('deleteConsequence'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, consequence_1.ConsequenceController.deleteConsequence);
router.route('/libraries/:libraryId').get((0, auth_1.auth)('getConsequences'), risklibrary_middleware_1.default, consequence_1.ConsequenceController.getConsequences);
exports.default = router;

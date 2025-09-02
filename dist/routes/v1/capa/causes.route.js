"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const causes_1 = require("../../../modules/capa/workspace/capalibrary/causes");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const capalibrary_middleware_1 = __importDefault(require("../../../modules/capa/workspace/capalibrary/capalibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createCauses'), capalibrary_middleware_1.default, (0, validate_1.validate)(causes_1.causeValidation.createCausesSchema), activitylogs_middleware_1.activityLoggerMiddleware, causes_1.causeController.createCause);
router
    .route('/libraries/:libraryId/cause/:causeId')
    .get((0, auth_1.auth)('getCause'), capalibrary_middleware_1.default, causes_1.causeController.getCauseById)
    .patch((0, auth_1.auth)('updateCause'), capalibrary_middleware_1.default, (0, validate_1.validate)(causes_1.causeValidation.updateCausesSchema), activitylogs_middleware_1.activityLoggerMiddleware, causes_1.causeController.updateCause)
    .delete((0, auth_1.auth)('deleteCause'), capalibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, causes_1.causeController.deleteCause);
router
    .route('/libraries/:libraryId/causes')
    .get((0, auth_1.auth)('getCauses'), capalibrary_middleware_1.default, causes_1.causeController.getCausesByLibrary);
router
    .route('/libraries/:libraryId/causes/names')
    .get((0, auth_1.auth)('getCausesNames'), capalibrary_middleware_1.default, causes_1.causeController.getCausesNamesByLibrary);
exports.default = router;

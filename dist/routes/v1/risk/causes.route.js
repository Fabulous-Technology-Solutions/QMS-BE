"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const causes_1 = require("../../../modules/risk/workspace/library/causes");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createCauses'), risklibrary_middleware_1.default, (0, validate_1.validate)(causes_1.causeValidation.createCausesSchema), activitylogs_middleware_1.activityLoggerMiddleware, causes_1.causeController.create);
router
    .route('/libraries/:libraryId/cause/:causeId')
    .get((0, auth_1.auth)('getCause'), risklibrary_middleware_1.default, causes_1.causeController.getById)
    .patch((0, auth_1.auth)('updateCause'), risklibrary_middleware_1.default, (0, validate_1.validate)(causes_1.causeValidation.updateCausesSchema), activitylogs_middleware_1.activityLoggerMiddleware, causes_1.causeController.update)
    .delete((0, auth_1.auth)('deleteCause'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, causes_1.causeController.delete);
router
    .route('/libraries/:libraryId/causes')
    .get((0, auth_1.auth)('getCauses'), risklibrary_middleware_1.default, causes_1.causeController.getByLibrary);
router
    .route('/libraries/:libraryId/causes/names')
    .get((0, auth_1.auth)('getCausesNames'), risklibrary_middleware_1.default, causes_1.causeController.getNamesByLibrary);
exports.default = router;

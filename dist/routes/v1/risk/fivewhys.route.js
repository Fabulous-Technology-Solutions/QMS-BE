"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fivewhys_1 = require("../../../modules/risk/workspace/library/fivewhys");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('Risk_createFiveWhys'), risklibrary_middleware_1.default, (0, validate_1.validate)(fivewhys_1.FiveWhyValidation.CreateFiveWhysRequestSchema), activitylogs_middleware_1.activityLoggerMiddleware, fivewhys_1.FiveWhysController.create);
router
    .route('/libraries/:libraryId/fivewhys/:fivewhysid')
    .get((0, auth_1.auth)('Risk_getFiveWhys'), risklibrary_middleware_1.default, fivewhys_1.FiveWhysController.getById)
    .patch((0, auth_1.auth)('Risk_updateFiveWhys'), risklibrary_middleware_1.default, (0, validate_1.validate)(fivewhys_1.FiveWhyValidation.UpdateFiveWhysRequestSchema), activitylogs_middleware_1.activityLoggerMiddleware, fivewhys_1.FiveWhysController.update)
    .delete((0, auth_1.auth)('Risk_deleteFiveWhys'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, fivewhys_1.FiveWhysController.delete);
router
    .route('/libraries/:libraryId/fivewhys')
    .get((0, auth_1.auth)('Risk_getFiveWhysByLibrary'), risklibrary_middleware_1.default, fivewhys_1.FiveWhysController.getByLibrary);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fivewhys_1 = require("../../modules/capa/workspace/capalibrary/fivewhys");
const express_1 = require("express");
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const capalibrary_middleware_1 = __importDefault(require("../../modules/capa/workspace/capalibrary/capalibrary.middleware"));
const activitylogs_middleware_1 = require("../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('createFiveWhys'), capalibrary_middleware_1.default, (0, validate_1.validate)(fivewhys_1.FiveWhyValidation.CreateFiveWhysRequestSchema), activitylogs_middleware_1.activityLoggerMiddleware, fivewhys_1.FiveWhysController.createFiveWhys);
router
    .route('/libraries/:libraryId/fivewhys/:fivewhysid')
    .get((0, auth_1.auth)('getFiveWhys'), capalibrary_middleware_1.default, fivewhys_1.FiveWhysController.getFiveWhys)
    .patch((0, auth_1.auth)('updateFiveWhys'), capalibrary_middleware_1.default, (0, validate_1.validate)(fivewhys_1.FiveWhyValidation.UpdateFiveWhysRequestSchema), activitylogs_middleware_1.activityLoggerMiddleware, fivewhys_1.FiveWhysController.updateFiveWhys)
    .delete((0, auth_1.auth)('deleteFiveWhys'), capalibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, fivewhys_1.FiveWhysController.deleteFiveWhys);
router
    .route('/libraries/:libraryId/fivewhys')
    .get((0, auth_1.auth)('getFiveWhysByLibrary'), capalibrary_middleware_1.default, fivewhys_1.FiveWhysController.getFiveWhysByLibrary);
exports.default = router;

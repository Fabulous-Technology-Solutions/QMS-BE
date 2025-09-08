"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ishikawa_1 = require("../../../modules/risk/workspace/library/Ishikawa");
const express_1 = require("express");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = (0, express_1.Router)();
router
    .route('/')
    .post((0, auth_1.auth)('Risk_createIshikawa'), risklibrary_middleware_1.default, (0, validate_1.validate)(Ishikawa_1.IshikawaValidation.CreateIshikawaSchema), activitylogs_middleware_1.activityLoggerMiddleware, Ishikawa_1.IshikawaController.create);
router
    .route('/libraries/:libraryId/ishikawa/:id')
    .get((0, auth_1.auth)('Risk_getIshikawa'), risklibrary_middleware_1.default, Ishikawa_1.IshikawaController.getById)
    .delete((0, auth_1.auth)('Risk_deleteIshikawa'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, Ishikawa_1.IshikawaController.delete);
router
    .route('/libraries/:libraryId/ishikawa')
    .get((0, auth_1.auth)('Risk_getIshikawaByLibrary'), risklibrary_middleware_1.default, Ishikawa_1.IshikawaController.getByLibrary);
exports.default = router;

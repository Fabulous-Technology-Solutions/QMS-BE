"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assessment_1 = require("../../../modules/risk/workspace/library/assessment");
const validate_1 = require("../../../modules/validate");
const auth_1 = require("../../../modules/auth");
const risklibrary_middleware_1 = __importDefault(require("../../../modules/risk/workspace/library/risklibrary.middleware"));
const activitylogs_middleware_1 = require("../../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router.post('/', (0, auth_1.auth)('risk_createAssessment'), risklibrary_middleware_1.default, (0, validate_1.validate)(assessment_1.AssessmentValidation.createAssessmentSchema), activitylogs_middleware_1.activityLoggerMiddleware, assessment_1.AssessmentController.create);
router.get('/libraries/:libraryId/assessment/monthly-data', (0, auth_1.auth)('risk_getAssessmentsByLibrary'), risklibrary_middleware_1.default, assessment_1.AssessmentController.getMonthlyAssessmentData);
router.get('/libraries/:libraryId', (0, auth_1.auth)('risk_getAssessmentsByLibrary'), risklibrary_middleware_1.default, assessment_1.AssessmentController.getByLibrary);
router.get('/libraries/:libraryId/assessment/:assessmentId', (0, auth_1.auth)('risk_getSingleAssessment'), risklibrary_middleware_1.default, assessment_1.AssessmentController.getById);
router.patch('/libraries/:libraryId/assessment/:assessmentId', (0, auth_1.auth)('risk_updateAssessment'), risklibrary_middleware_1.default, (0, validate_1.validate)(assessment_1.AssessmentValidation.updateAssessmentSchema), activitylogs_middleware_1.activityLoggerMiddleware, assessment_1.AssessmentController.update);
router.delete('/libraries/:libraryId/assessment/:assessmentId', (0, auth_1.auth)('risk_deleteAssessment'), risklibrary_middleware_1.default, activitylogs_middleware_1.activityLoggerMiddleware, assessment_1.AssessmentController.deleteObj);
exports.default = router;

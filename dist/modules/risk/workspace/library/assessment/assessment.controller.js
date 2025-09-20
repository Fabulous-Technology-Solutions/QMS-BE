"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyAssessmentData = exports.getByLibrary = exports.deleteObj = exports.update = exports.getById = exports.create = void 0;
const AssessmentServices = __importStar(require("./assessment.services"));
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
exports.create = (0, catchAsync_1.default)(async (req, res) => {
    const assessment = await AssessmentServices.createAssessment({
        ...req.body,
        createdBy: req.user._id
    });
    res.locals["message"] = "create assessment";
    res.locals["documentId"] = assessment._id;
    res.locals["collectionName"] = "RiskAssessment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = assessment;
    res.status(201).json(assessment);
});
exports.getById = (0, catchAsync_1.default)(async (req, res) => {
    const assessment = await AssessmentServices.getAssessmentById(req.params["assessmentId"] || '');
    res.status(200).json(assessment);
});
exports.update = (0, catchAsync_1.default)(async (req, res) => {
    const assessment = await AssessmentServices.updateAssessment(req.params["assessmentId"] || '', req.body);
    res.locals["message"] = "update assessment";
    res.locals["documentId"] = assessment._id;
    res.locals["collectionName"] = "RiskAssessment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = assessment;
    res.status(200).json(assessment);
});
exports.deleteObj = (0, catchAsync_1.default)(async (req, res) => {
    const assessment = await AssessmentServices.deleteAssessment(req.params["assessmentId"] || '');
    res.locals["message"] = "delete assessment";
    res.locals["documentId"] = assessment._id;
    res.locals["collectionName"] = "RiskAssessment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = assessment;
    res.status(200).json(assessment);
});
exports.getByLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { search = '', page = 1, limit = 10 } = req.query;
    const assessments = await AssessmentServices.getAssessmentsByLibrary(libraryId, Number(page), Number(limit), search);
    res.status(200).json(assessments);
});
exports.getMonthlyAssessmentData = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const year = parseInt(req.query['year']) || new Date().getFullYear();
    const data = await AssessmentServices.getMonthlyAssessmentData(libraryId, year);
    res.status(200).json({ success: true, data });
});

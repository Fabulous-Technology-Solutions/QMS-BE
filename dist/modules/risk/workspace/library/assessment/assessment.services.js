"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentsByLibrary = exports.deleteAssessment = exports.updateAssessment = exports.getAssessmentById = exports.createAssessment = void 0;
const assessment_modal_1 = __importDefault(require("./assessment.modal"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const upload_middleware_1 = require("../../../../upload/upload.middleware");
const createAssessment = async (data) => {
    const assessment = new assessment_modal_1.default(data);
    await assessment.save();
    return assessment;
};
exports.createAssessment = createAssessment;
const getAssessmentById = async (id) => {
    const assessment = await assessment_modal_1.default.findById(id).where({ isDeleted: false }).populate('createdBy', 'name email profilePicture').populate('evaluator', 'name email profilePicture');
    if (!assessment) {
        throw new ApiError_1.default("Assessment not found", 404);
    }
    return assessment;
};
exports.getAssessmentById = getAssessmentById;
const updateAssessment = async (id, data) => {
    const assessment = await assessment_modal_1.default.findByIdAndUpdate(id, data, { new: false }).where({ isDeleted: false });
    if (!assessment) {
        throw new ApiError_1.default("Assessment not found or already deleted", 404);
    }
    if (assessment.templateKey !== data.templateKey) {
        await (0, upload_middleware_1.deleteMedia)(assessment.templateKey);
    }
    Object.assign(assessment, data);
    return assessment;
};
exports.updateAssessment = updateAssessment;
const deleteAssessment = async (id) => {
    const assessment = await assessment_modal_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).where({ isDeleted: false });
    if (!assessment) {
        throw new ApiError_1.default("Assessment not found or already deleted", 404);
    }
    await (0, upload_middleware_1.deleteMedia)(assessment.templateKey);
    return assessment;
};
exports.deleteAssessment = deleteAssessment;
const getAssessmentsByLibrary = async (libraryId, page, limit, search) => {
    const query = {
        library: libraryId,
        isDeleted: false,
        name: { $regex: search, $options: 'i' },
    };
    const assessments = await assessment_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'name email profilePicture')
        .populate('evaluator', 'name email profilePicture');
    const total = await assessment_modal_1.default.countDocuments(query);
    return {
        data: assessments,
        total,
        page,
        limit,
        success: true
    };
};
exports.getAssessmentsByLibrary = getAssessmentsByLibrary;

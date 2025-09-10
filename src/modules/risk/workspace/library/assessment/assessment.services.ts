import AssessmentModel from "./assessment.modal";
import AppiError from "../../../../errors/ApiError";
import {CreateAssessmentRequest} from "./assessment.interfaces";
import { deleteMedia } from "../../../../upload/upload.middleware";

const createAssessment = async (data: CreateAssessmentRequest) => {
        const assessment = new AssessmentModel(data);
        await assessment.save();
        return assessment;
};

const getAssessmentById = async (id: string) => {
    const assessment = await AssessmentModel.findById(id).where({ isDeleted: false }).populate('createdBy', 'name email profilePicture').populate('evaluator', 'name email profilePicture');
    if (!assessment) {
        throw new AppiError("Assessment not found", 404);
    }
    return assessment;
};
const updateAssessment = async (id: string, data: Partial<CreateAssessmentRequest>) => {
    const assessment = await AssessmentModel.findByIdAndUpdate(id, data, { new: false }).where({ isDeleted: false });
    if (!assessment) {
        throw new AppiError("Assessment not found or already deleted", 404);
    }
    if (assessment.templateKey!==data.templateKey) {
        await deleteMedia(assessment.templateKey as string);
    }
    Object.assign(assessment, data);
    return assessment;
};
const deleteAssessment = async (id: string) => {
    const assessment = await AssessmentModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).where({ isDeleted: false });
    if (!assessment) {
        throw new AppiError("Assessment not found or already deleted", 404);
    }
    await deleteMedia(assessment.templateKey as string);
    return assessment;
};
const getAssessmentsByLibrary = async (libraryId: string, page: number, limit: number, search: string) => {
    const query = {
        library: libraryId,
        isDeleted: false,
        name: { $regex: search, $options: 'i' },
    };
    const assessments = await AssessmentModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'name email profilePicture')
        .populate('evaluator', 'name email profilePicture');
    const total = await AssessmentModel.countDocuments(query);
    return {
        data: assessments,
        total,
        page,
        limit,
        success: true
    };
};
export {
    createAssessment,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    getAssessmentsByLibrary
};
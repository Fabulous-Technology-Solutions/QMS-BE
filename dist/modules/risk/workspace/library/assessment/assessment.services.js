"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyAssessmentData = exports.getAssessmentsByLibrary = exports.deleteAssessment = exports.updateAssessment = exports.getAssessmentById = exports.createAssessment = void 0;
const assessment_modal_1 = __importDefault(require("./assessment.modal"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const upload_middleware_1 = require("../../../../upload/upload.middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const createAssessment = async (data) => {
    const assessment = new assessment_modal_1.default(data);
    await assessment.save();
    return assessment;
};
exports.createAssessment = createAssessment;
const getAssessmentById = async (id) => {
    const assessments = await assessment_modal_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id),
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            profilePicture: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'accounts',
                localField: 'avaluator',
                foreignField: '_id',
                as: 'evaluator',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user',
                            pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                    { $unwind: { path: '$user' } },
                    {
                        $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$createdBy',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$evaluator',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
    const assessment = assessments[0];
    if (!assessment) {
        throw new ApiError_1.default('Assessment not found', 404);
    }
    return assessment;
};
exports.getAssessmentById = getAssessmentById;
const updateAssessment = async (id, data) => {
    const assessment = await assessment_modal_1.default.findByIdAndUpdate(id, data, { new: false }).where({ isDeleted: false });
    if (!assessment) {
        throw new ApiError_1.default('Assessment not found or already deleted', 404);
    }
    if (assessment.templateKey !== data.templateKey) {
        await (0, upload_middleware_1.deleteMedia)(assessment.templateKey);
    }
    Object.assign(assessment, data);
    return assessment;
};
exports.updateAssessment = updateAssessment;
const deleteAssessment = async (id) => {
    const assessment = await assessment_modal_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).where({
        isDeleted: false,
    });
    if (!assessment) {
        throw new ApiError_1.default('Assessment not found or already deleted', 404);
    }
    await (0, upload_middleware_1.deleteMedia)(assessment.templateKey);
    return assessment;
};
exports.deleteAssessment = deleteAssessment;
const getAssessmentsByLibrary = async (libraryId, page, limit, search) => {
    const pipeline = [
        {
            $match: {
                library: new mongoose_1.default.Types.ObjectId(libraryId),
                isDeleted: false,
                name: { $regex: search, $options: 'i' },
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            profilePicture: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'accounts',
                localField: 'evaluator',
                foreignField: '_id',
                as: 'evaluator',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user',
                            pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                    { $unwind: { path: '$user' } },
                    {
                        $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$createdBy',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$evaluator',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $facet: {
                data: [
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ],
                total: [
                    { $count: 'count' }
                ]
            }
        }
    ];
    const result = await assessment_modal_1.default.aggregate(pipeline);
    const assessments = result[0].data;
    const total = result[0].total[0]?.count || 0;
    return {
        data: assessments,
        total,
        page,
        limit,
        success: true,
    };
};
exports.getAssessmentsByLibrary = getAssessmentsByLibrary;
const getMonthlyAssessmentData = async (libraryId, year) => {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    // Fetch only months that have assessments
    const rawData = await assessment_modal_1.default.aggregate([
        {
            $match: {
                library: new mongoose_1.default.Types.ObjectId(libraryId),
                isDeleted: false,
                createdAt: { $gte: startOfYear, $lte: endOfYear },
            },
        },
        {
            $addFields: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $group: {
                _id: { year: '$year', month: '$month' },
                assessmentId: { $first: '$_id' },
                probability: { $first: '$probability' },
                impact: { $first: '$impact' },
                createdAt: { $first: '$createdAt' },
            },
        },
        {
            $project: {
                _id: 0,
                month: '$_id.month',
                riskScore: { $multiply: ['$probability', '$impact'] },
            },
        },
        {
            $sort: { month: 1 },
        },
    ]);
    // Post-process → ensure all 12 months included
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
        const existing = rawData.find((d) => d.month === month);
        if (existing) {
            monthlyData.push(existing);
        }
        else {
            monthlyData.push({
                month,
                riskScore: 0,
            });
        }
    }
    return monthlyData;
};
exports.getMonthlyAssessmentData = getMonthlyAssessmentData;

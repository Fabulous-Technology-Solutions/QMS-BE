"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteControlService = exports.updateControlService = exports.getControlByIdService = exports.getAllControlService = exports.createActionService = void 0;
const control_modal_1 = __importDefault(require("./control.modal"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
const createActionService = async (data) => {
    const control = new control_modal_1.default(data);
    return control.save();
};
exports.createActionService = createActionService;
const getAllControlService = async (libraryId, page = 1, limit = 10, search) => {
    const skip = (page - 1) * limit;
    const matchStage = { library: new mongoose_1.default.Types.ObjectId(libraryId) };
    if (search) {
        matchStage.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    const result = await control_modal_1.default.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'accounts',
                localField: 'owners',
                foreignField: '_id',
                as: 'owners',
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
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                controls: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: "total" }
                ]
            }
        }
    ]);
    const controls = result[0].controls;
    const total = result[0].totalCount[0]?.total || 0;
    return {
        controls,
        total,
        page,
        limit
    };
};
exports.getAllControlService = getAllControlService;
const getControlByIdService = async (id) => {
    const result = await control_modal_1.default.aggregate([
        { $match: { _id: new (require('mongoose')).Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'accounts',
                localField: 'owners',
                foreignField: '_id',
                as: 'owners',
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
        }
    ]);
    const control = result[0];
    if (!control) {
        throw new ApiError_1.default('Control not found', 404);
    }
    return control;
};
exports.getControlByIdService = getControlByIdService;
const updateControlService = async (id, data) => {
    const control = await control_modal_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!control) {
        throw new ApiError_1.default('Control not found', 404);
    }
    return control;
};
exports.updateControlService = updateControlService;
const deleteControlService = async (id) => {
    const control = await control_modal_1.default.findByIdAndDelete(id);
    if (!control) {
        throw new ApiError_1.default('Control not found', 404);
    }
    return control;
};
exports.deleteControlService = deleteControlService;

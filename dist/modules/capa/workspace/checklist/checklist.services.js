"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckListNamesByWorkspaceId = exports.getCheckListByWorkspaceId = exports.deleteCheckList = exports.updateCheckList = exports.getCheckListById = exports.createCheckList = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checklist_modal_1 = __importDefault(require("./checklist.modal"));
const createCheckList = async (data) => {
    const checklist = new checklist_modal_1.default(data);
    await checklist.save();
    return checklist;
};
exports.createCheckList = createCheckList;
const getCheckListById = async (checklistId) => {
    const checklist = await checklist_modal_1.default.findOne({ _id: checklistId, isDelete: false }).populate('workspace', 'name description');
    if (!checklist) {
        throw new Error('Checklist not found');
    }
    return checklist;
};
exports.getCheckListById = getCheckListById;
const updateCheckList = async (checklistId, data) => {
    const checklist = await checklist_modal_1.default.findOneAndUpdate({ _id: checklistId, isDelete: false }, data, { new: true });
    if (!checklist) {
        throw new Error('Checklist not found');
    }
    return checklist;
};
exports.updateCheckList = updateCheckList;
const deleteCheckList = async (checklistId) => {
    const checklist = await checklist_modal_1.default.findOneAndUpdate({ _id: checklistId }, { isDelete: true }, { new: true });
    if (!checklist) {
        throw new Error('Checklist not found');
    }
    return checklist;
};
exports.deleteCheckList = deleteCheckList;
const getCheckListByWorkspaceId = async (workspaceId, search, page, limit) => {
    const match = {
        workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
        isDelete: false,
    };
    if (search) {
        match.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    console.log("limit", limit);
    console.log("page", page);
    const results = await checklist_modal_1.default.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        { $unwind: { path: '$workspace', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                name: 1,
                description: 1,
                workspace: { name: 1, description: 1 },
            },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ]);
    const total = await checklist_modal_1.default.countDocuments(match);
    return {
        data: results,
        total,
        page,
        limit,
    };
};
exports.getCheckListByWorkspaceId = getCheckListByWorkspaceId;
const getCheckListNamesByWorkspaceId = async (workspaceId) => {
    const checklists = await checklist_modal_1.default.find({ workspace: workspaceId, isDelete: false }).select('name');
    return checklists;
};
exports.getCheckListNamesByWorkspaceId = getCheckListNamesByWorkspaceId;

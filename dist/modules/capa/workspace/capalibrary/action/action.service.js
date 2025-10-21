"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionsByWorkspace = exports.getActionsByAssignedTo = exports.deleteAction = exports.getActionsByLibrary = exports.getLibraryMembersByAction = exports.updateAction = exports.getActionById = exports.createAction = void 0;
const account_modal_1 = __importDefault(require("../../../../account/account.modal"));
const action_modal_1 = __importDefault(require("./action.modal"));
const mongoose_1 = __importDefault(require("mongoose"));
const notification_services_1 = require("../../../../notification/notification.services");
const createAction = async (data) => {
    const action = new action_modal_1.default(data);
    await action.save();
    if (data.assignedTo && data.assignedTo.length > 0) {
        if (data.assignedTo && data.assignedTo.length > 0) {
            const assignedUsers = await account_modal_1.default.find({
                _id: { $in: data.assignedTo },
            }).populate('user', 'name email _id');
            // Loop through all assigned users
            for (const account of assignedUsers) {
                if (!account.user?._id)
                    continue; // Skip if no linked user
                const notificationParams = {
                    userId: account.user._id,
                    title: 'Task Assigned',
                    message: `${data?.user?.name || 'Someone'} assigned you a task`,
                    type: 'task',
                    notificationFor: 'Action',
                    forId: action._id,
                    sendEmailNotification: true,
                    link: `/capa/${data.moduleId}/workspace/${data.workspaceId}/library/detail/${data.library}?activeTabIndex=2`,
                };
                // Add accountId if available
                if (account.accountId) {
                    notificationParams.accountId = account.accountId;
                }
                // Send notification for each assigned user
                (0, notification_services_1.createNotification)(notificationParams, data.workspaceId, 'taskassign');
            }
        }
    }
    return action;
};
exports.createAction = createAction;
const getActionById = async (actionId, userId) => {
    const match = { _id: new mongoose_1.default.Types.ObjectId(actionId), isDeleted: false };
    if (userId) {
        match.assignedTo = { $in: [new mongoose_1.default.Types.ObjectId(userId)] };
    }
    const result = await action_modal_1.default.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
            },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'accounts',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
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
            $lookup: {
                from: 'libraries',
                localField: 'library',
                foreignField: '_id',
                as: 'library',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: { path: '$library', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
                assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
                library: { name: 1, description: 1, _id: 1 },
                _id: 1,
                name: 1,
                description: 1,
                priority: 1,
                type: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                docfile: 1,
                docfileKey: 1,
            },
        },
    ]);
    const action = result[0];
    if (!action) {
        throw new Error('Action not found');
    }
    return action;
};
exports.getActionById = getActionById;
const updateAction = async (actionId, data, userId) => {
    const match = { _id: actionId, isDeleted: false };
    if (userId) {
        match.assignedTo = { $in: [new mongoose_1.default.Types.ObjectId(userId)] };
    }
    const action = await action_modal_1.default.findOneAndUpdate({ _id: actionId, isDeleted: false }, data, { new: true });
    if (!action) {
        throw new Error('Action not found');
    }
    return action;
};
exports.updateAction = updateAction;
const getLibraryMembersByAction = async (actionId = '', search = '', page = 1, limit = 10) => {
    const result = await action_modal_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(actionId), isDeleted: false } },
        {
            $lookup: {
                from: 'libraries',
                localField: 'library',
                foreignField: '_id',
                as: 'library',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: '$library' },
        { $project: { members: '$library.members' } },
        { $unwind: '$members' },
        ...(search
            ? [
                {
                    $match: {
                        $or: [
                            { 'members.name': { $regex: search, $options: 'i' } },
                            { 'members.email': { $regex: search, $options: 'i' } },
                        ],
                    },
                },
            ]
            : []),
        {
            $facet: {
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                totalCount: [{ $count: 'count' }],
            },
        },
    ]);
    if (!result.length) {
        throw new Error('Action not found');
    }
    const members = result[0].data;
    const totalCount = result[0].totalCount[0]?.count || 0;
    return { members, totalCount, page, limit };
};
exports.getLibraryMembersByAction = getLibraryMembersByAction;
const getActionsByLibrary = async (libraryId, page = 1, limit = 10, search = '') => {
    const matchStage = { library: new mongoose_1.default.Types.ObjectId(libraryId), isDeleted: false };
    const searchStages = search
        ? [
            {
                $match: {
                    $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
                },
            },
        ]
        : [];
    const result = await action_modal_1.default.aggregate([
        { $match: matchStage },
        ...searchStages,
        {
            $lookup: {
                from: 'libraries',
                localField: 'library',
                foreignField: '_id',
                as: 'library',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: '$library' },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'accounts',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
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
            $lookup: {
                from: 'causes',
                localField: 'cause',
                foreignField: '_id',
                as: 'cause',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                priority: 1,
                type: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                cause: { name: 1, description: 1, _id: 1 },
                createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
                assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
                library: { name: 1, description: 1, _id: 1 },
                docfile: 1,
                docfileKey: 1,
            },
        },
        {
            $facet: {
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                totalCount: [{ $count: 'count' }],
                stats: [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            counts: { $push: { status: '$_id', count: '$count' } },
                            total: { $sum: '$count' },
                        },
                    },
                    {
                        $addFields: {
                            counts: {
                                $map: {
                                    input: ['pending', 'in-progress', 'completed', 'on-hold'],
                                    as: 'status',
                                    in: {
                                        status: '$$status',
                                        count: {
                                            $let: {
                                                vars: {
                                                    found: {
                                                        $arrayElemAt: [
                                                            {
                                                                $filter: {
                                                                    input: '$counts',
                                                                    as: 'c',
                                                                    cond: { $eq: ['$$c.status', '$$status'] },
                                                                },
                                                            },
                                                            0,
                                                        ],
                                                    },
                                                },
                                                in: { $ifNull: ['$$found.count', 0] },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        $addFields: {
                            completed: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$counts',
                                            as: 'c',
                                            cond: { $eq: ['$$c.status', 'completed'] },
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                    {
                        $addFields: {
                            percentageCompleted: {
                                $cond: [
                                    { $eq: ['$total', 0] },
                                    0,
                                    {
                                        $multiply: [
                                            {
                                                $divide: [{ $ifNull: ['$completed.count', 0] }, '$total'],
                                            },
                                            100,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        },
    ]);
    const actions = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    // Ensure stats object exists
    const stats = result[0]?.stats[0] || {
        counts: [
            { status: 'pending', count: 0 },
            { status: 'in-progress', count: 0 },
            { status: 'completed', count: 0 },
            { status: 'on-hold', count: 0 },
        ],
        total: 0,
        percentageCompleted: 0,
    };
    return { actions, totalCount, stats, page, limit };
};
exports.getActionsByLibrary = getActionsByLibrary;
const deleteAction = async (actionId, userId) => {
    const action = await action_modal_1.default.findOneAndUpdate({ _id: actionId, isDeleted: false, ...(userId ? { assignedTo: userId } : {}) }, { isDeleted: true }, { new: true });
    if (!action) {
        throw new Error('Action not found');
    }
    return action;
};
exports.deleteAction = deleteAction;
const getActionsByAssignedTo = async (userId, page = 1, limit = 10, search = '') => {
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const matchStage = {
        assignedTo: { $in: [userObjectId] },
        isDeleted: false,
    };
    const searchStages = search
        ? [
            {
                $match: {
                    $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
                },
            },
        ]
        : [];
    const result = await action_modal_1.default.aggregate([
        { $match: matchStage },
        ...searchStages,
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'libraries',
                let: {
                    libraryId: '$library',
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['$_id', '$$libraryId'] }, { $eq: ['$isDeleted', false] }],
                            },
                        },
                    },
                ],
                as: 'library',
            },
        },
        { $unwind: { path: '$library' } },
        {
            $lookup: {
                from: 'accounts',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
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
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                priority: 1,
                type: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                createdBy: { name: 1, email: 1, profilePicture: 1, _id: 1 },
                assignedTo: { name: 1, email: 1, profilePicture: 1, _id: 1 },
                library: { name: 1, description: 1, _id: 1 },
            },
        },
        {
            $facet: {
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                totalCount: [{ $count: 'count' }],
            },
        },
    ]);
    const actions = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;
    return {
        data: actions,
        total,
        page,
        limit,
    };
};
exports.getActionsByAssignedTo = getActionsByAssignedTo;
const getActionsByWorkspace = async (workspaceId, page = 1, limit = 10, search = '') => {
    const matchStage = { isDeleted: false, endDate: { $lt: new Date() }, status: { $ne: 'completed' } };
    const searchStages = search
        ? [
            {
                $match: {
                    $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
                },
            },
        ]
        : [];
    const result = await action_modal_1.default.aggregate([
        { $match: matchStage },
        ...searchStages,
        {
            $lookup: {
                from: 'libraries',
                localField: 'library',
                foreignField: '_id',
                as: 'library',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: '$library' },
        {
            $match: { 'library.workspace': new mongoose_1.default.Types.ObjectId(workspaceId) },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'accounts',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedTo',
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
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                priority: 1,
                type: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                createdBy: { name: 1, email: 1, profilePicture: 1 },
                assignedTo: { name: 1, email: 1, profilePicture: 1 },
                library: { name: 1, description: 1, _id: 1 },
            },
        },
        {
            $facet: {
                data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                totalCount: [{ $count: 'count' }],
            },
        },
    ]);
    const actions = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    return { data: actions, total: totalCount, page, limit, message: 'Actions retrieved successfully', success: true };
};
exports.getActionsByWorkspace = getActionsByWorkspace;

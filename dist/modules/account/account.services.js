"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserBelongToCapaLibrary = exports.findUserBelongToRiskLibrary = exports.checkUserBelongsToAccount = exports.updateAccountById = exports.getModuleWorkspaces = exports.switchAccount = exports.getAccountById = exports.deleteAccountById = exports.getAllAccounts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const account_modal_1 = __importDefault(require("./account.modal"));
const getAllAccounts = async (accountId, page = 1, limit = 10, searchUsername) => {
    const skip = (page - 1) * limit;
    const pipeline = [
        {
            $match: {
                accountId: new mongoose_1.default.Types.ObjectId(accountId),
                role: { $in: ['admin'] },
            },
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'Permissions.workspace',
                foreignField: '_id',
                as: 'workspaceDetails',
                pipeline: [
                    {
                        $lookup: {
                            from: 'subscriptions',
                            localField: 'moduleId',
                            foreignField: '_id',
                            as: 'module',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'plans',
                                        localField: 'planId',
                                        foreignField: '_id',
                                        as: 'plan',
                                        pipeline: [{ $project: { _id: 1, name: 1 } }],
                                    },
                                },
                                { $unwind: '$plan' },
                            ],
                        },
                    },
                    { $unwind: '$module' },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails',
                pipeline: [{ $project: { _id: 1, name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $unwind: '$userDetails' },
        // --- Flatten workspaces ---
        { $unwind: '$workspaceDetails' },
        // --- Group by user + plan (module) to keep unique modules ---
        {
            $group: {
                _id: {
                    userId: '$userDetails._id',
                    planId: '$workspaceDetails.module.plan._id',
                },
                account: { $first: '$$ROOT' },
                user: { $first: '$userDetails' },
                planName: { $first: '$workspaceDetails.module.plan.name' },
            },
        },
        // --- Group again by user to collect modules ---
        {
            $group: {
                _id: '$user._id',
                user: { $first: '$user' },
                account: { $first: '$account' },
                modules: { $addToSet: { name: '$planName' } }, // addToSet ensures unique modules
            },
        },
        {
            $project: {
                _id: 0,
                user: 1,
                modules: 1,
                account: { role: '$account.role', id: '$account._id', status: '$account.status' },
            },
        },
        // Pagination
        { $skip: skip },
        { $limit: limit },
    ];
    // Add search filter if username is provided
    if (searchUsername) {
        pipeline.push({
            $match: {
                $or: [
                    { 'userDetails.name': { $regex: searchUsername, $options: 'i' } },
                    { 'userDetails.email': { $regex: searchUsername, $options: 'i' } },
                ],
            },
        });
    }
    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });
    const accounts = await account_modal_1.default.aggregate(pipeline);
    // Get total count for pagination info
    const totalPipeline = pipeline.slice(0, -2); // Remove skip and limit
    if (searchUsername) {
        totalPipeline.push({ $count: 'total' });
    }
    else {
        totalPipeline.push({ $count: 'total' });
    }
    const totalResult = await account_modal_1.default.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;
    return {
        accounts,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getAllAccounts = getAllAccounts;
const deleteAccountById = async (accountId) => {
    const account = await account_modal_1.default.findByIdAndDelete(accountId);
    return account;
};
exports.deleteAccountById = deleteAccountById;
const getAccountById = async (Id) => {
    const pipeline = [
        {
            $match: { _id: new mongoose_1.default.Types.ObjectId(Id) },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { _id: 1, name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $unwind: '$user' },
    ];
    const result = await account_modal_1.default.aggregate(pipeline);
    return result[0] || null;
};
exports.getAccountById = getAccountById;
const switchAccount = async (userId, accountId) => {
    console.log('Switching account for userId:', userId, 'to accountId:', accountId);
    const pipeline = [
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(accountId),
                user: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'Permissions.workspace',
                foreignField: '_id',
                as: 'workspaceDetails',
                pipeline: [
                    {
                        $lookup: {
                            from: 'subscriptions',
                            localField: 'moduleId',
                            foreignField: '_id',
                            as: 'module',
                            pipeline: [
                                {
                                    $lookup: {
                                        from: 'plans',
                                        localField: 'planId',
                                        foreignField: '_id',
                                        as: 'plan',
                                        pipeline: [{ $project: { _id: 1, name: 1, description: 1 } }],
                                    },
                                },
                                { $unwind: '$plan' },
                            ],
                        },
                    },
                    { $unwind: '$module' },
                ],
            },
        },
        { $unwind: '$workspaceDetails' },
        {
            $group: {
                _id: '$workspaceDetails.module._id',
                planName: { $first: '$workspaceDetails.module.plan.name' },
                description: { $first: '$workspaceDetails.module.plan.description' },
                account: { $first: '$$ROOT' },
            },
        },
        {
            $group: {
                _id: '$_id.user',
                modules: { $addToSet: { _id: '$_id', name: '$planName', description: '$description' } },
                account: { $first: '$account' },
            },
        },
        {
            $project: {
                _id: 0,
                modules: 1,
            },
        },
    ];
    const result = await account_modal_1.default.aggregate(pipeline);
    const account = result[0] || null;
    if (!account) {
        throw new Error('Account not found or does not belong to the user');
    }
    return account;
};
exports.switchAccount = switchAccount;
const getModuleWorkspaces = async (accountId, moduleId, userId, page = 1, limit = 10, searchWorkspace) => {
    const skip = (page - 1) * limit;
    const pipeline = [
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(accountId),
                user: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'Permissions.workspace',
                foreignField: '_id',
                as: 'workspaceDetails',
                pipeline: [
                    {
                        $match: {
                            'moduleId': new mongoose_1.default.Types.ObjectId(moduleId),
                        },
                    },
                ],
            },
        },
        { $unwind: '$workspaceDetails' },
    ];
    // Add search filter if searchWorkspace is provided
    if (searchWorkspace) {
        pipeline.push({
            $match: {
                'workspaceDetails.name': { $regex: searchWorkspace, $options: 'i' },
            },
        });
    }
    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit }, {
        $project: {
            _id: 0,
            workspace: '$workspaceDetails',
        },
    });
    const workspaces = await account_modal_1.default.aggregate(pipeline);
    // Get total count for pagination info
    const totalPipeline = pipeline.slice(0, -3); // Remove skip, limit, and project
    totalPipeline.push({ $count: 'total' });
    const totalResult = await account_modal_1.default.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;
    return {
        results: workspaces.map(w => w.workspace),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getModuleWorkspaces = getModuleWorkspaces;
const updateAccountById = async (Id, updateBody) => {
    const account = await account_modal_1.default.findByIdAndUpdate(Id, updateBody, { new: true });
    return account;
};
exports.updateAccountById = updateAccountById;
const checkUserBelongsToAccount = async (userId, accountId, workspaceId) => {
    const account = await account_modal_1.default.findOne({ _id: accountId, user: userId, 'Permissions.workspace': workspaceId });
    if (!account) {
        throw new Error('Account not found or does not belong to the user');
    }
    return !!account; // returns true if account exists, false otherwise
};
exports.checkUserBelongsToAccount = checkUserBelongsToAccount;
const findUserBelongToRiskLibrary = async (userId, accountId, libraryId) => {
    const account = await account_modal_1.default.aggregate([
        {
            $match: {
                _id: accountId,
                user: userId,
            },
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'Permissions.workspace',
                foreignField: '_id',
                as: 'workspaceDetails',
                pipeline: [
                    {
                        $lookup: {
                            from: 'risklibraries',
                            localField: '_id',
                            foreignField: 'workspace',
                            as: 'libraryDetails',
                            pipeline: [
                                {
                                    $match: {
                                        _id: new mongoose_1.default.Types.ObjectId(libraryId),
                                    },
                                },
                            ],
                        },
                    },
                    { $unwind: '$libraryDetails' },
                ],
            },
        },
        { $unwind: '$workspaceDetails' },
    ]);
    if (!account) {
        throw new Error('Account not found or does not belong to the user');
    }
    return !!account; // returns true if account exists, false otherwise
};
exports.findUserBelongToRiskLibrary = findUserBelongToRiskLibrary;
const findUserBelongToCapaLibrary = async (userId, accountId, libraryId) => {
    const account = await account_modal_1.default.aggregate([
        {
            $match: {
                _id: accountId,
                user: userId,
            },
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'Permissions.workspace',
                foreignField: '_id',
                as: 'workspaceDetails',
                pipeline: [
                    {
                        $lookup: {
                            from: 'libraries',
                            localField: '_id',
                            foreignField: 'workspace',
                            as: 'libraryDetails',
                            pipeline: [
                                {
                                    $match: {
                                        _id: new mongoose_1.default.Types.ObjectId(libraryId),
                                    },
                                },
                            ],
                        },
                    },
                    { $unwind: '$libraryDetails' },
                ],
            },
        },
        { $unwind: '$workspaceDetails' },
    ]);
    if (!account) {
        throw new Error('Account not found or does not belong to the user');
    }
    return !!account; // returns true if account exists, false otherwise
};
exports.findUserBelongToCapaLibrary = findUserBelongToCapaLibrary;

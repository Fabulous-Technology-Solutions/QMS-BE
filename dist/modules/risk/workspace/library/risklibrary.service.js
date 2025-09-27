"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setassessmentApproval = exports.setriskappetite = exports.generateFilterReport = exports.generateReport = exports.deletePermanent = exports.restoreLibrary = exports.getLibrariesByManager = exports.checkUserBelongsToLibrary = exports.checkSubAdminBelongsToLibrary = exports.checkAdminBelongsTtoLibrary = exports.getLibraryMembers = exports.removeMemberFromLibrary = exports.addMemberToLibrary = exports.getLibrariesNames = exports.deleteLibrary = exports.updateLibrary = exports.getLibrariesfilterData = exports.getLibrariesByWorkspace = exports.getLibraryById = exports.CreateLibrary = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const risklibrary_modal_1 = require("./risklibrary.modal");
const user_subAdmin_1 = __importDefault(require("../../../user/user.subAdmin"));
const activitylogs_modal_1 = __importDefault(require("../../../activitylogs/activitylogs.modal"));
const pdfTemplateRisk_1 = require("../../../utils/pdfTemplateRisk");
const upload_middleware_1 = require("../../../upload/upload.middleware");
const puppeteer_config_1 = require("../../../../utils/puppeteer.config");
const workspace_modal_1 = __importDefault(require("../../../../modules/workspace/workspace.modal"));
const chat_services_1 = require("../../../../modules/chat/chat.services");
const CreateLibrary = async (body) => {
    const findWorkspace = await workspace_modal_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(body.workspace), isDeleted: false } },
        { $lookup: { from: 'subscriptions', localField: 'moduleId', foreignField: '_id', as: 'module' } },
        { $unwind: '$module' },
        {
            $lookup: {
                from: 'plans',
                localField: 'module.planId',
                foreignField: '_id',
                as: 'plan',
                pipeline: [
                    {
                        $match: { category: 'risk-management' },
                    },
                ],
            },
        },
        { $unwind: '$plan' },
    ]);
    if (!findWorkspace || findWorkspace.length === 0) {
        throw new Error('Workspace not found');
    }
    const library = new risklibrary_modal_1.LibraryModel(body);
    await (0, chat_services_1.createChat)({
        obj: library._id,
        chatOf: 'RiskLibrary',
        workspace: body.workspace,
    });
    return await library.save();
};
exports.CreateLibrary = CreateLibrary;
const getLibraryById = async (libraryId) => {
    const data = await risklibrary_modal_1.LibraryModel.findOne({ _id: libraryId, isDeleted: false })
        .populate('members', 'name email profilePicture')
        .populate('managers', 'name email profilePicture')
        .populate('site', 'name')
        .populate('process', 'name');
    if (!data) {
        throw new Error('Library not found');
    }
    return data;
};
exports.getLibraryById = getLibraryById;
const getLibrariesByWorkspace = async (workspaceId, page, limit, search, isDeleted) => {
    const matchStage = { workspace: new mongoose_1.default.Types.ObjectId(workspaceId), isDeleted };
    if (search) {
        matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'riskactions',
                localField: '_id',
                foreignField: 'library',
                as: 'tasks',
                pipeline: [
                    { $match: { isDeleted: false } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignedTo',
                            pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'riskcauses',
                            localField: 'cause',
                            foreignField: '_id',
                            as: 'cause',
                            pipeline: [{ $project: { name: 1, description: 1 } }],
                        },
                    },
                    { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'deletedBy',
                foreignField: '_id',
                as: 'deletedBy',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $unwind: { path: '$deletedBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'sites',
                localField: 'site',
                foreignField: '_id',
                as: 'site',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: 'processes',
                localField: 'process',
                foreignField: '_id',
                as: 'process',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $unwind: { path: '$process', preserveNullAndEmptyArrays: true },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const data = await risklibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Get total count for pagination
    const countPipeline = [{ $match: matchStage }, { $count: 'total' }];
    const countResult = await risklibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        total,
        page,
        limit,
        success: true,
        message: 'Libraries retrieved successfully',
    };
};
exports.getLibrariesByWorkspace = getLibrariesByWorkspace;
const getLibrariesfilterData = async (workspaceId, page, limit, search) => {
    const matchStage = {
        workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
        isDeleted: false,
        status: 'pending',
    };
    const days = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    if (search) {
        matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    const pipeline = [
        { $match: { ...matchStage, updatedAt: { $lte: cutoffDate } } },
        {
            $lookup: {
                from: 'riskactions',
                localField: '_id',
                foreignField: 'library',
                as: 'tasks',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignedTo',
                            pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'riskcauses',
                            localField: 'cause',
                            foreignField: '_id',
                            as: 'cause',
                            pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, description: 1 } }],
                        },
                    },
                    { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'sites',
                localField: 'site',
                foreignField: '_id',
                as: 'site',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: 'processes',
                localField: 'process',
                foreignField: '_id',
                as: 'process',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $unwind: { path: '$process', preserveNullAndEmptyArrays: true },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const data = await risklibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Get total count for pagination
    const countPipeline = [{ $match: { ...matchStage, updatedAt: { $lte: cutoffDate } } }, { $count: 'total' }];
    const countResult = await risklibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        total,
        page,
        limit,
        success: true,
        message: 'Libraries retrieved successfully',
    };
};
exports.getLibrariesfilterData = getLibrariesfilterData;
const updateLibrary = async (libraryId, updateData) => {
    const library = await risklibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, updateData, { new: true })
        .populate('members', 'name email profilePicture')
        .populate('managers', 'name email profilePicture');
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.updateLibrary = updateLibrary;
const deleteLibrary = async (libraryId, userId) => {
    const library = await risklibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, { isDeleted: true, deletedBy: userId, deletedAt: new Date() }, { new: true });
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.deleteLibrary = deleteLibrary;
const getLibrariesNames = async (workspaceId) => {
    return await risklibrary_modal_1.LibraryModel.find({ workspace: workspaceId, isDeleted: false }, 'name');
};
exports.getLibrariesNames = getLibrariesNames;
const addMemberToLibrary = async (libraryId, members) => {
    try {
        const library = await (0, exports.getLibraryById)(libraryId);
        if (!library) {
            throw new Error('Library not found');
        }
        const existingMemberIds = library.members.map((m) => m.toString());
        const managerIds = library.managers.map((m) => m.toString());
        for (const memberId of members) {
            const idStr = memberId.toString();
            // Skip if already a member
            if (existingMemberIds.includes(idStr)) {
                continue; // just skip instead of throwing
            }
            // Skip if a manager
            if (managerIds.includes(idStr)) {
                continue;
            }
            library.members.push(memberId);
        }
        return await risklibrary_modal_1.LibraryModel.updateOne({ _id: library._id }, { members: library.members }, { new: true });
    }
    catch (error) {
        console.error('Error adding members to library:', error);
        throw new Error('Failed to add members to library');
    }
};
exports.addMemberToLibrary = addMemberToLibrary;
const removeMemberFromLibrary = async (libraryId, memberId) => {
    // Ensure the library exists before removing a member
    const library = await (0, exports.getLibraryById)(libraryId);
    if (!library) {
        throw new Error('Library not found');
    }
    if (!library.members.some((member) => member && member['_id'] && member['_id'].toString() === memberId.toString())) {
        throw new Error('Member is not in the library');
    }
    library.members = library.members.filter((member) => member['_id'].toString() !== memberId.toString());
    console.log('Member removed from library:', memberId, library);
    return await library.save();
};
exports.removeMemberFromLibrary = removeMemberFromLibrary;
const getLibraryMembers = async (libraryId, page = 1, limit = 10, search = '') => {
    let objectId;
    try {
        objectId = new mongoose_1.default.Types.ObjectId(libraryId);
    }
    catch (err) {
        throw new Error('Invalid libraryId');
    }
    const matchStage = {
        _id: objectId,
        // isDeleted: false,
    };
    const memberMatch = { name: {} };
    if (search) {
        memberMatch['name'] = { $regex: search, $options: 'i' };
    }
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [
                    { $match: { isDeleted: false } },
                    ...(search ? [{ $match: memberMatch }] : []),
                    { $project: { name: 1, email: 1, profilePicture: 1, role: 1, status: 1 } },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [
                    { $match: { isDeleted: false } },
                    { $project: { name: 1, email: 1, profilePicture: 1, role: 1, status: 1 } },
                ],
            },
        },
        { $unwind: '$members' },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const result = await risklibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Optionally, get total count for pagination
    const countPipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [...(search ? [{ $match: memberMatch }] : [])],
            },
        },
        { $unwind: '$members' },
        { $count: 'total' },
    ];
    const countResult = await risklibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data: result.map((r) => r.members),
        total,
        page,
        limit,
        success: true,
        message: 'Library member(s) retrieved successfully',
    };
};
exports.getLibraryMembers = getLibraryMembers;
const checkAdminBelongsTtoLibrary = async (libraryId, userId) => {
    const Querydata = {
        _id: new mongoose_1.default.Types.ObjectId(libraryId),
        isDeleted: false,
    };
    // if (dataType === 'mydocuments') {
    //   Querydata['managers'] = { $in: [userId] };
    // }
    const library = await risklibrary_modal_1.LibraryModel.aggregate([
        { $match: Querydata },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        { $unwind: '$workspace' },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'workspace.moduleId',
                foreignField: '_id',
                as: 'module',
            },
        },
        { $unwind: '$module' },
        {
            $match: {
                'module.userId': userId,
            },
        },
        {
            $lookup: {
                from: 'plans',
                localField: 'module.planId',
                foreignField: '_id',
                as: 'plan',
                pipeline: [
                    {
                        $match: { category: 'risk-management' },
                    },
                ],
            },
        },
        { $unwind: '$plan' },
    ]);
    console.log('Admin belongs to library:', library, userId, Querydata);
    if (!library || library.length === 0) {
        throw new Error('Library not found for this admin');
    }
    return true;
};
exports.checkAdminBelongsTtoLibrary = checkAdminBelongsTtoLibrary;
const checkSubAdminBelongsToLibrary = async (libraryId, userId, dataType) => {
    const Querydata = {
        'libraries._id': new mongoose_1.default.Types.ObjectId(libraryId),
        'libraries.isDeleted': false,
    };
    if (dataType === 'mydocuments') {
        Querydata['libraries.managers'] = { $in: [userId] };
    }
    const library = await user_subAdmin_1.default.aggregate([
        { $match: { _id: userId, isDeleted: false } },
        {
            $lookup: {
                from: 'workspaces',
                let: { workspaceIds: '$adminOF.workspacePermissions' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: [
                                    '$_id',
                                    {
                                        $reduce: {
                                            input: '$$workspaceIds',
                                            initialValue: [],
                                            in: { $concatArrays: ['$$value', '$$this'] },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            description: 1,
                        },
                    },
                ],
                as: 'workspace',
            },
        },
        { $unwind: '$workspace' },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'workspace.moduleId',
                foreignField: '_id',
                as: 'module',
            },
        },
        { $unwind: '$module' },
        {
            $lookup: {
                from: 'plans',
                localField: 'module.planId',
                foreignField: '_id',
                as: 'plan',
                pipeline: [
                    {
                        $match: { category: 'risk-management' },
                    },
                ],
            },
        },
        { $unwind: '$plan' },
        {
            $lookup: {
                from: 'risklibraries',
                localField: 'workspace._id',
                foreignField: 'workspace',
                as: 'libraries',
            },
        },
        { $unwind: '$libraries' },
        {
            $match: Querydata,
        },
    ]);
    if (!library || library.length === 0) {
        throw new Error('Library not found');
    }
    return true;
};
exports.checkSubAdminBelongsToLibrary = checkSubAdminBelongsToLibrary;
const checkUserBelongsToLibrary = async (libraryId, user, dataType) => {
    const Querydata = {
        _id: new mongoose_1.default.Types.ObjectId(libraryId),
        isDeleted: false,
    };
    console.log('Query data for user library check:', libraryId, 'User ID:', user?._id);
    if (dataType === 'mydocuments') {
        Querydata['managers'] = { $in: [new mongoose_1.default.Types.ObjectId(user?._id)] };
    }
    console.log('Query data for user library check:', Querydata, 'User ID:', dataType);
    const result = await risklibrary_modal_1.LibraryModel.aggregate([
        {
            $match: Querydata,
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        { $unwind: '$workspace' },
        {
            $match: {
                'workspace._id': user.workspace,
            },
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'workspace.moduleId',
                foreignField: '_id',
                as: 'module',
            },
        },
        { $unwind: '$module' },
        {
            $lookup: {
                from: 'plans',
                localField: 'module.planId',
                foreignField: '_id',
                as: 'plan',
                pipeline: [
                    {
                        $match: { category: 'risk-management' },
                    },
                ],
            },
        },
        { $unwind: '$plan' },
    ]);
    if (!result || result.length === 0) {
        throw new Error('User does not belong to this library');
    }
    return true;
};
exports.checkUserBelongsToLibrary = checkUserBelongsToLibrary;
const getLibrariesByManager = async (workspaceId, managerId, page, limit, search) => {
    const matchStage = {
        workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
        managers: { $in: [new mongoose_1.default.Types.ObjectId(managerId)] },
        isDeleted: false,
    };
    if (search) {
        matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'riskactions',
                localField: '_id',
                foreignField: 'library',
                as: 'tasks',
                pipeline: [
                    { $match: { isDeleted: false } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignedTo',
                            pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'riskcauses',
                            localField: 'cause',
                            foreignField: '_id',
                            as: 'cause',
                            pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, description: 1 } }],
                        },
                    },
                    { $unwind: { path: '$cause', preserveNullAndEmptyArrays: true } },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'sites',
                localField: 'site',
                foreignField: '_id',
                as: 'site',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: 'processes',
                localField: 'process',
                foreignField: '_id',
                as: 'process',
                pipeline: [{ $project: { name: 1 } }],
            },
        },
        {
            $unwind: { path: '$process', preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const data = await risklibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Get total count for pagination
    const countPipeline = [{ $match: matchStage }, { $count: 'total' }];
    const countResult = await risklibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        total,
        page,
        limit,
        success: true,
        message: 'Libraries retrieved successfully',
    };
};
exports.getLibrariesByManager = getLibrariesByManager;
const restoreLibrary = async (libraryIds, workspaceId, userId) => {
    console.log('Permanently deleting libraries with IDs:', libraryIds);
    const result = await risklibrary_modal_1.LibraryModel.updateMany({ _id: { $in: libraryIds } }, { isDeleted: false });
    if (result.modifiedCount === 0) {
        throw new Error('No libraries were restored');
    }
    await Promise.all(libraryIds.map((id) => activitylogs_modal_1.default.create({
        action: 'restore',
        collectionName: 'RiskLibrary',
        documentId: id,
        changes: { isDeleted: false },
        performedBy: userId,
        logof: workspaceId,
        message: 'Library restored',
    })));
    return result;
};
exports.restoreLibrary = restoreLibrary;
const deletePermanent = async (libraryIds, workspaceId, userId) => {
    console.log('Permanently deleting libraries with IDs:', libraryIds);
    const result = await risklibrary_modal_1.LibraryModel.deleteMany({ _id: { $in: libraryIds } });
    if (result.deletedCount === 0) {
        throw new Error('No libraries were deleted');
    }
    await Promise.all(libraryIds.map((id) => activitylogs_modal_1.default.create({
        action: 'delete',
        collectionName: 'RiskLibrary',
        documentId: id,
        changes: { isDeleted: true },
        performedBy: userId,
        logof: workspaceId,
        message: 'Library permanently deleted',
    })));
    return result;
};
exports.deletePermanent = deletePermanent;
const generateReport = async (libraryId) => {
    let browser;
    let page;
    try {
        // 1. Launch headless browser
        browser = await (0, puppeteer_config_1.launchBrowser)();
        page = await browser?.newPage();
        const [findLibrary] = await risklibrary_modal_1.LibraryModel.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(libraryId), isDeleted: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'members',
                    pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'managers',
                    foreignField: '_id',
                    as: 'managers',
                    pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'riskcauses',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'causes',
                    pipeline: [{ $project: { name: 1, description: 1, createdAt: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'riskactions',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'actions',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'assignedTo',
                                foreignField: '_id',
                                as: 'assignedTo',
                                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                profilePicture: 1,
                                status: 1,
                                createdAt: 1,
                                endDate: 1,
                                startDate: 1,
                                assignedTo: 1,
                                cause: 1,
                                docfile: 1,
                                deleteLibrary: 1,
                                personnel: 1,
                                budget: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'controls',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'controls',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'owners',
                                foreignField: '_id',
                                as: 'owners',
                                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                description: 1,
                                controlType: 1,
                                effectiveness: 1,
                                createdAt: 1,
                                owners: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    closedActions: {
                        $size: {
                            $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'closed'] } } }, []],
                        },
                    },
                    inProgressActions: {
                        $size: {
                            $ifNull: [
                                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'in-progress'] } } },
                                [],
                            ],
                        },
                    },
                    openActions: {
                        $size: {
                            $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'open'] } } }, []],
                        },
                    },
                },
            },
        ]);
        // if (!findLibrary) {
        //   throw new Error('Library not found');
        // };
        const pdfContent = await (0, pdfTemplateRisk_1.pdfTemplate)(findLibrary);
        await page.setContent(pdfContent, {
            waitUntil: 'networkidle0',
            timeout: 120000,
        });
        const pdfBuffer = await page?.pdf({
            format: 'a4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm' },
            timeout: 120000, // 2 minutes timeout for PDF generation
        });
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-Report.pdf`;
        // Convert Uint8Array to Buffer
        const buffer = Buffer.from(new Uint8Array(pdfBuffer || []));
        const response = await (0, upload_middleware_1.uploadSingleFile)(uniqueFileName, buffer, 'application/pdf', false);
        if (!response) {
            throw new Error('Failed to upload PDF');
        }
        return response;
    }
    catch (error) {
        console.error('Error generating PDF report:', error);
        throw error;
    }
    finally {
        // Ensure browser is always closed
        if (page) {
            try {
                await page.close();
                console.log('Page closed');
            }
            catch (err) {
                console.warn('Error closing page:', err);
            }
        }
        if (browser) {
            try {
                await browser.close();
                console.log('Browser closed');
            }
            catch (err) {
                console.warn('Error closing browser:', err);
            }
        }
    }
};
exports.generateReport = generateReport;
const generateFilterReport = async (workspaceId, site, process, status) => {
    let browser;
    let page;
    try {
        // 1. Launch headless browser
        console.log('Generating filtered report with:', { workspaceId, site, process, status });
        const query = {
            workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
            ...(site && { site: new mongoose_1.default.Types.ObjectId(site) }),
            ...(process && { process: new mongoose_1.default.Types.ObjectId(process) }),
            ...(status && { status }),
        };
        const findLibraries = await risklibrary_modal_1.LibraryModel.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'members',
                    pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'managers',
                    foreignField: '_id',
                    as: 'managers',
                    pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'riskcauses',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'causes',
                    pipeline: [{ $project: { name: 1, description: 1, createdAt: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'riskactions',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'actions',
                    pipeline: [
                        { $match: { isDeleted: false } },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'assignedTo',
                                foreignField: '_id',
                                as: 'assignedTo',
                                pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, profilePicture: 1 } }],
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                profilePicture: 1,
                                status: 1,
                                createdAt: 1,
                                priority: 1,
                                endDate: 1,
                                startDate: 1,
                                type: 1,
                                assignedTo: 1,
                                cause: 1,
                                docfile: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    openActions: {
                        $size: {
                            $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'open'] } } }, []],
                        },
                    },
                    inProgressActions: {
                        $size: {
                            $ifNull: [
                                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'in-progress'] } } },
                                [],
                            ],
                        },
                    },
                    closedActions: {
                        $size: {
                            $ifNull: [{ $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'closed'] } } }, []],
                        },
                    },
                },
            },
        ]);
        console.log(findLibraries, 'Filtered libraries for report:');
        if (findLibraries.length === 0) {
            console.log('No libraries found for report');
            return null;
        }
        browser = await (0, puppeteer_config_1.launchBrowser)();
        page = await browser?.newPage();
        const pdfContent = await (0, pdfTemplateRisk_1.pdfTemplateforMutiples)(findLibraries);
        console.log('PDF content generated', pdfContent);
        await page.setContent(pdfContent, {
            waitUntil: 'networkidle0',
            timeout: 120000,
        });
        const pdfBuffer = await page?.pdf({
            format: 'a4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm' },
            timeout: 120000, // 2 minutes timeout for PDF generation
        });
        console.log('PDF buffer generated', pdfBuffer);
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-Report.pdf`;
        // Convert Uint8Array to Buffer
        const buffer = Buffer.from(new Uint8Array(pdfBuffer || []));
        const response = await (0, upload_middleware_1.uploadSingleFile)(uniqueFileName, buffer, 'application/pdf', false);
        if (!response) {
            throw new Error('Failed to upload PDF');
        }
        return response;
    }
    catch (error) {
        console.error('Error generating PDF report:', error);
        throw error;
    }
    finally {
        // Ensure browser is always closed
        if (page) {
            try {
                await page.close();
                console.log('Page closed');
            }
            catch (err) {
                console.warn('Error closing page:', err);
            }
        }
        if (browser) {
            try {
                await browser.close();
                console.log('Browser closed');
            }
            catch (err) {
                console.warn('Error closing browser:', err);
            }
        }
    }
};
exports.generateFilterReport = generateFilterReport;
const setriskappetite = async (libraryId, riskappetite) => {
    const library = await risklibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, { riskappetite: riskappetite }, { new: true });
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.setriskappetite = setriskappetite;
const setassessmentApproval = async (libraryId, assessmentApproval) => {
    const library = await risklibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, { assessmentApproval }, { new: true });
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.setassessmentApproval = setassessmentApproval;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardAnalytics = exports.deleteCapaworkspace = exports.updateCapaworkspace = exports.getCapaworkspaceById = exports.getAllCapaworkspaces = exports.createCapaworkspace = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const workspace_modal_1 = __importDefault(require("./workspace.modal"));
const capalibrary_modal_1 = require("../capa/workspace/capalibrary/capalibrary.modal");
const action_modal_1 = __importDefault(require("../capa/workspace/capalibrary/action/action.modal"));
const createCapaworkspace = async (data) => {
    const { moduleId, name, imageUrl, imagekey, description, user } = data;
    const workspace = new workspace_modal_1.default({
        moduleId,
        name,
        imageUrl,
        imagekey,
        description,
        createdBy: user._id,
    });
    if (user.role !== 'admin') {
        user.adminOF?.forEach((admin) => {
            if (admin.method.equals(moduleId)) {
                admin.workspacePermissions.push(workspace._id);
            }
        });
    }
    await user.save();
    return await workspace.save();
};
exports.createCapaworkspace = createCapaworkspace;
const getAllCapaworkspaces = async (body) => {
    const { moduleId, Page, Limit, user, search } = body;
    const page = Page || 1;
    const limit = Limit || 10;
    const skip = (page - 1) * limit;
    const query = {
        moduleId: new mongoose_1.default.Types.ObjectId(moduleId),
        isDeleted: false,
    };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (user.role !== 'admin') {
        const adminData = user.adminOF?.find((admin) => admin.method.equals(moduleId));
        if (adminData?.workspacePermissions &&
            Array.isArray(adminData.workspacePermissions) &&
            adminData.workspacePermissions.length > 0) {
            query._id = { $in: adminData?.workspacePermissions || [] };
        }
        else {
            return { results: [], total: 0 };
        }
    }
    const [results, totalCountArr] = await Promise.all([
        workspace_modal_1.default.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'modules',
                    localField: 'moduleId',
                    foreignField: '_id',
                    as: 'module',
                },
            },
            {
                $unwind: {
                    path: '$module',
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $skip: skip },
            { $limit: limit },
        ]),
        workspace_modal_1.default.countDocuments(query),
    ]);
    return { results, total: totalCountArr, page };
};
exports.getAllCapaworkspaces = getAllCapaworkspaces;
const getCapaworkspaceById = async (workspaceId) => {
    return await workspace_modal_1.default.findOne({ _id: workspaceId, isDeleted: false })
        .populate('moduleId', 'name')
        .populate('createdBy', 'name email');
};
exports.getCapaworkspaceById = getCapaworkspaceById;
const updateCapaworkspace = async (workspaceId, data) => {
    return await workspace_modal_1.default.findOneAndUpdate({ _id: workspaceId, isDeleted: false }, data, { new: true });
};
exports.updateCapaworkspace = updateCapaworkspace;
const deleteCapaworkspace = async (workspaceId) => {
    return await workspace_modal_1.default.findOneAndUpdate({ _id: workspaceId, isDeleted: false }, { isDeleted: true }, { new: true });
};
exports.deleteCapaworkspace = deleteCapaworkspace;
const dashboardAnalytics = async (workspaceId) => {
    const result = await capalibrary_modal_1.LibraryModel.aggregate([
        {
            $match: {
                workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
                isDeleted: false,
                status: { $in: ['pending', 'completed', 'in-progress'] },
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);
    // First, get all library IDs for the workspace
    const libraries = await capalibrary_modal_1.LibraryModel.find({
        workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
        isDeleted: false,
    }).select('_id');
    const libraryIds = libraries.map((lib) => lib._id);
    // Now, aggregate actions by libraryId
    const actionresult = await action_modal_1.default.aggregate([
        {
            $match: {
                library: { $in: libraryIds },
                isDeleted: false,
                status: { $in: ['pending', 'completed', 'in-progress', 'on-hold'] },
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);
    const actionAnalytics = { pending: 0, complete: 0, inProgress: 0, onHold: 0, total: 0 };
    actionresult.forEach((item) => {
        if (item._id === 'pending')
            actionAnalytics.pending = item.count;
        if (item._id === 'completed')
            actionAnalytics.complete = item.count;
        if (item._id === 'in-progress')
            actionAnalytics.inProgress = item.count;
        if (item._id === 'on-hold')
            actionAnalytics.onHold = item.count;
        actionAnalytics.total += item.count;
    });
    const analytics = { pending: 0, complete: 0, inProgress: 0, total: 0 };
    result.forEach((item) => {
        if (item._id === 'pending')
            analytics.pending = item.count;
        if (item._id === 'completed')
            analytics.complete = item.count;
        if (item._id === 'in-progress')
            analytics.inProgress = item.count;
        analytics.total += item.count;
    });
    return {
        libraryAnalytics: analytics,
        actionAnalytics: actionAnalytics,
    };
};
exports.dashboardAnalytics = dashboardAnalytics;

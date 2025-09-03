"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWorkSubadminBelongsToWorkspace = exports.checkAdminBelongsToWorkspace = exports.getworkspacerolenames = exports.getworkspaceRoles = exports.getRoleById = exports.deleteRole = exports.updateRole = exports.createRole = void 0;
const user_model_1 = __importDefault(require("../../../user/user.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const workspace_modal_1 = __importDefault(require("../../../workspace/workspace.modal"));
const manageRole_modal_1 = __importDefault(require("./manageRole.modal"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const createRole = (data) => {
    const role = new manageRole_modal_1.default({
        name: data.name,
        description: data.description,
        permissions: data.permissions,
        workspace: data.workspace,
        process: data.process,
        site: data.site
    });
    return role.save();
};
exports.createRole = createRole;
const updateRole = async (id, data) => {
    const role = await manageRole_modal_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: true });
    if (!role) {
        throw new ApiError_1.default('Role not found', http_status_1.default.NOT_FOUND);
    }
    return role.save();
};
exports.updateRole = updateRole;
const deleteRole = async (id) => {
    const role = await manageRole_modal_1.default.findOne({ _id: id, isDeleted: false });
    if (!role) {
        throw new ApiError_1.default('Role not found', http_status_1.default.NOT_FOUND);
    }
    role.isDeleted = true;
    return role.save();
};
exports.deleteRole = deleteRole;
const getRoleById = async (id) => {
    const role = await manageRole_modal_1.default.findOne({ _id: id, isDeleted: false }).populate('workspace').populate('process', 'name').populate('site', 'name');
    if (!role) {
        throw new ApiError_1.default('Role not found', http_status_1.default.NOT_FOUND);
    }
    return role;
};
exports.getRoleById = getRoleById;
const getworkspaceRoles = async (data) => {
    const { workspace, search, page, limit } = data;
    const query = { workspace: workspace, isDeleted: false, };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const roles = await manageRole_modal_1.default.find(query).populate('process', 'name').populate('site', 'name').skip((page - 1) * limit).limit(limit);
    const total = await manageRole_modal_1.default.countDocuments(query);
    return {
        total,
        roles,
        page,
    };
};
exports.getworkspaceRoles = getworkspaceRoles;
const getworkspacerolenames = async (workspaceId) => {
    const roles = await manageRole_modal_1.default.find({ workspace: workspaceId, isDeleted: false }).select('name');
    if (!roles || roles.length === 0) {
        throw new ApiError_1.default('No roles found for this workspace', http_status_1.default.NOT_FOUND);
    }
    return roles;
};
exports.getworkspacerolenames = getworkspacerolenames;
const checkAdminBelongsToWorkspace = async (userId, workspaceId) => {
    const user = await workspace_modal_1.default.aggregate([
        {
            $match: { _id: new mongoose_1.default.Types.ObjectId(workspaceId), isDeleted: false },
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'moduleId',
                foreignField: '_id',
                as: 'subscription',
            },
        },
        {
            $unwind: '$subscription',
        },
        {
            $match: { 'subscription.userId': new mongoose_1.default.Types.ObjectId(userId) },
        },
    ]);
    if (!user || user?.length === 0) {
        throw new ApiError_1.default('User does not belong to the workspace', http_status_1.default.FORBIDDEN);
    }
    return user;
};
exports.checkAdminBelongsToWorkspace = checkAdminBelongsToWorkspace;
const checkWorkSubadminBelongsToWorkspace = async (userId, workspaceId) => {
    const findworkspace = await workspace_modal_1.default.findOne({
        _id: workspaceId,
        isDeleted: false
    });
    if (!findworkspace) {
        throw new ApiError_1.default('Workspace not found', http_status_1.default.NOT_FOUND);
    }
    const user = await user_model_1.default.findOne({
        _id: userId,
        adminOf: {
            $elemMatch: {
                workspacePermissions: workspaceId
            }
        },
        isDeleted: false
    });
    if (!user) {
        throw new ApiError_1.default('User does not belong to the workspace', http_status_1.default.FORBIDDEN);
    }
    return user;
};
exports.checkWorkSubadminBelongsToWorkspace = checkWorkSubadminBelongsToWorkspace;

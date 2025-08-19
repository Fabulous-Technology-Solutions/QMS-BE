"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleWorkspaceUser = exports.getWorkspaceUsers = exports.deleteWorkspaceUser = exports.updateWorkspaceUser = exports.createWorkspaceUser = void 0;
const workspaceUser_modal_1 = __importDefault(require("./workspaceUser.modal"));
const user_model_1 = __importDefault(require("../../user/user.model"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const tokenService = __importStar(require("../../token/token.service"));
const email_service_1 = require("../../email/email.service");
const mongoose_1 = __importDefault(require("mongoose"));
const upload_middleware_1 = require("../../upload/upload.middleware");
const createWorkspaceUser = async (data) => {
    if (await user_model_1.default.isEmailTaken(data.email)) {
        throw new ApiError_1.default('Email already taken', http_status_1.default.BAD_REQUEST);
    }
    const user = new workspaceUser_modal_1.default({
        workspace: data.workspace,
        roleId: data.roleId,
        name: data.name,
        email: data.email,
        role: 'workspaceUser',
        status: data.status,
        profilePicture: data.profilePicture,
    });
    await user.save();
    const inviteToken = await tokenService.generateInviteToken(data.email);
    const inviteUrl = `${process.env['CLIENT_URL']}/invite?email=${encodeURIComponent(data.email)}&token=${inviteToken}`;
    const htmlbodyforsendpassword = `
      <p>Welcome to Tellust, ${data.name}!</p>
      <p>Email: ${data.email}</p>
      <p>Please click the button below to accept your invitation and set your password or proceed with Google:</p>
      <a href="${inviteUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Accept Invitation</a>
      <p>If you did not expect this invitation, you can ignore this email.</p>
    `;
    (0, email_service_1.sendEmail)(data.email, 'Welcome to Tellust! Accept Your Invitation', '', htmlbodyforsendpassword);
    return user;
};
exports.createWorkspaceUser = createWorkspaceUser;
const updateWorkspaceUser = async (id, data) => {
    // Find and update the user in a single request, returning the old document
    console.log('Updating workspace user with data:', data);
    const user = await workspaceUser_modal_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: data }, { new: false } // return the old document before update
    );
    console.log(' user with data:', user);
    if (!user) {
        throw new ApiError_1.default('User not found', http_status_1.default.NOT_FOUND);
    }
    // If profile picture is being updated, delete the old one if needed
    if (data.profilePicture &&
        data.profilePictureKey &&
        user.profilePictureKey &&
        user.profilePictureKey !== data.profilePictureKey) {
        (0, upload_middleware_1.deleteMedia)(user.profilePictureKey);
    }
    // Now get the updated user
    const updatedUser = await workspaceUser_modal_1.default.findById(id);
    return updatedUser?.save();
};
exports.updateWorkspaceUser = updateWorkspaceUser;
const deleteWorkspaceUser = async (id) => {
    const user = await workspaceUser_modal_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) {
        throw new Error('User not found');
    }
    return user.save();
};
exports.deleteWorkspaceUser = deleteWorkspaceUser;
const getWorkspaceUsers = async (workspaceId, page, limit, search) => {
    const match = { workspace: new mongoose_1.default.Types.ObjectId(workspaceId), isDeleted: false };
    if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        match.$or = [{ name: regex }, { email: regex }];
    }
    const users = await workspaceUser_modal_1.default.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'role',
            },
        },
        {
            $unwind: {
                path: '$role',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                status: 1,
                profilePicture: 1,
                role: {
                    _id: '$role._id',
                    name: '$role.name',
                },
            },
        },
        { $sort: { name: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ]);
    const total = await workspaceUser_modal_1.default.countDocuments(match);
    return { users, total, page, limit };
};
exports.getWorkspaceUsers = getWorkspaceUsers;
const getSingleWorkspaceUser = async (userId) => {
    const user = await workspaceUser_modal_1.default.findOne({ _id: userId, isDeleted: false }).populate('roleId', 'name');
    if (!user) {
        throw new ApiError_1.default('User not found', http_status_1.default.NOT_FOUND);
    }
    return user;
};
exports.getSingleWorkspaceUser = getSingleWorkspaceUser;

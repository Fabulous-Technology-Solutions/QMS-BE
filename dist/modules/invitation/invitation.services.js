"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvitation = exports.getInvitationsByWorkspace = exports.getInvitationsByInvitedBy = exports.getAllInvitations = exports.deleteInvitation = exports.updateInvitation = exports.getInvitationByToken = exports.getInvitationByEmail = exports.createInvitation = void 0;
const invitation_modal_1 = __importDefault(require("./invitation.modal"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const account_1 = require("../account");
const createInvitation = async (invitation) => {
    // check if invitation already exists
    const existingInvitation = await invitation_modal_1.default.findOne({
        email: invitation.email,
        status: 'pending',
        role: invitation.role,
        ...(invitation.role === 'workspaceUser' && {
            'Permissions.workspace': { $in: invitation?.Permissions?.flatMap((item) => item.workspace) || [] },
        }),
    }).lean();
    if (existingInvitation) {
        throw new ApiError_1.default('Invitation already sent to this email pending', 400);
    }
    const account = await account_1.AccountModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        { $unwind: '$userDetails' },
        {
            $match: {
                'userDetails.email': invitation.email,
                accountId: invitation.accountId,
                $and: [
                    {
                        role: invitation.role === 'workspaceUser' ? 'workspaceUser' : 'admin',
                        ...(invitation.role === 'workspaceUser' && {
                            'Permissions.workspace': { $in: invitation?.Permissions?.flatMap((item) => item.workspace) || [] },
                        }),
                    },
                ],
            },
        },
        { $project: { _id: 1 } },
    ]);
    if (account.length) {
        throw new ApiError_1.default('User with this email already has an account access', 400);
    }
    /// create token logic here
    const token = Math.random().toString(36).substring(2);
    invitation.token = token;
    invitation.status = 'pending';
    // save to db
    const newInvitation = new invitation_modal_1.default(invitation);
    return await newInvitation.save();
};
exports.createInvitation = createInvitation;
const getInvitationByEmail = async (email) => {
    return await invitation_modal_1.default.find({ email }).lean();
};
exports.getInvitationByEmail = getInvitationByEmail;
const getInvitationByToken = async (token) => {
    return await invitation_modal_1.default.find({ token }).lean();
};
exports.getInvitationByToken = getInvitationByToken;
const updateInvitation = async (token, updateData) => {
    return await invitation_modal_1.default.findOneAndUpdate({ token }, updateData, { new: true }).lean();
};
exports.updateInvitation = updateInvitation;
const deleteInvitation = async (token) => {
    return await invitation_modal_1.default.findOneAndDelete({ token }).lean();
};
exports.deleteInvitation = deleteInvitation;
const getAllInvitations = async () => {
    return await invitation_modal_1.default.find().lean();
};
exports.getAllInvitations = getAllInvitations;
const getInvitationsByInvitedBy = async (invitedBy, page, limit, search) => {
    const skip = (page - 1) * limit;
    const query = {
        invitedBy,
        role: { $in: ['admin', 'standardUser'] },
        status: 'pending',
    };
    if (search) {
        query.$or = [
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
        ];
    }
    const [invitations, total] = await Promise.all([
        invitation_modal_1.default.find(query).skip(skip).limit(limit).lean(),
        invitation_modal_1.default.countDocuments(query),
    ]);
    return {
        invitations,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getInvitationsByInvitedBy = getInvitationsByInvitedBy;
const getInvitationsByWorkspace = async (workspaceId, page, limit, search) => {
    const skip = (page - 1) * limit;
    const query = {
        'Permissions.workspace': workspaceId,
        role: { $in: ['workspaceUser'] },
        status: 'pending',
    };
    if (search) {
        query.$or = [
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
        ];
    }
    const [invitations, total] = await Promise.all([
        invitation_modal_1.default.find(query).skip(skip).limit(limit).lean(),
        invitation_modal_1.default.countDocuments(query),
    ]);
    return {
        invitations,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getInvitationsByWorkspace = getInvitationsByWorkspace;
const acceptInvitation = async (token, user) => {
    console.log('token', token, 'user', user);
    const invitation = await invitation_modal_1.default.findOne({ token, status: 'pending', email: user.email });
    if (!invitation) {
        throw new ApiError_1.default('Invalid request due to invalid email or already accepted invitation', 400);
    }
    invitation.status = 'accepted';
    const account = await account_1.AccountModel.create({
        role: invitation.role,
        user: user._id,
        Permissions: invitation.Permissions,
        accountId: invitation.accountId,
        status: 'active',
    });
    await invitation.save();
    return account;
};
exports.acceptInvitation = acceptInvitation;

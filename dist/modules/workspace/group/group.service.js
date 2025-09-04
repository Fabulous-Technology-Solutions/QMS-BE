"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupUsers = exports.removeMemberFromGroup = exports.addMemberToGroup = exports.getGroupsNames = exports.deleteGroup = exports.updateGroup = exports.getGroupsByWorkspace = exports.getGroupById = exports.CreateGroup = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const group_modal_1 = __importDefault(require("./group.modal"));
const user_model_1 = __importDefault(require("../../user/user.model"));
const CreateGroup = async (groupData) => {
    const group = new group_modal_1.default(groupData);
    return await group.save();
};
exports.CreateGroup = CreateGroup;
const getGroupById = async (groupId) => {
    return await group_modal_1.default.findById(groupId).populate('members', 'name email profilePicture');
};
exports.getGroupById = getGroupById;
const getGroupsByWorkspace = async (body) => {
    const query = { workspace: body.workspace, isDeleted: false };
    if (body.search) {
        query.name = { $regex: body.search, $options: 'i' };
    }
    const data = await group_modal_1.default.find(query)
        .skip((body.page - 1) * body.limit)
        .limit(body.limit)
        .populate('members', 'name email profilePicture');
    const total = await group_modal_1.default.countDocuments(query);
    return {
        data,
        total,
        page: body.page,
        limit: body.limit,
        success: true,
        message: 'Groups retrieved successfully',
    };
};
exports.getGroupsByWorkspace = getGroupsByWorkspace;
const updateGroup = async (groupId, updateData) => {
    return await group_modal_1.default.findByIdAndUpdate(groupId, updateData, { new: true }).populate('members', 'name email profilePicture');
};
exports.updateGroup = updateGroup;
const deleteGroup = async (groupId) => {
    return await group_modal_1.default.findByIdAndUpdate(groupId, { isDeleted: true }, { new: true });
};
exports.deleteGroup = deleteGroup;
const getGroupsNames = async (workspaceId) => {
    return await group_modal_1.default.find({ workspace: workspaceId, isDeleted: false }, 'name');
};
exports.getGroupsNames = getGroupsNames;
const addMemberToGroup = async (groupId, memberId) => {
    // Ensure the group exists before adding a member
    const group = await (0, exports.getGroupById)(groupId);
    if (!group) {
        throw new Error('Group not found');
    }
    // check if the member is already in the group
    if (group.members.includes(memberId)) {
        throw new Error('Member is already in the group');
    }
    return await group_modal_1.default.findByIdAndUpdate(groupId, { $addToSet: { members: memberId } }, { new: true }).populate('members', 'name email profilePicture');
};
exports.addMemberToGroup = addMemberToGroup;
const removeMemberFromGroup = async (groupId, memberId) => {
    const group = await (0, exports.getGroupById)(groupId);
    if (!group) {
        throw new Error('Group not found');
    }
    console.log('Group members:', group.members);
    console.log('Member ID to remove:', new mongoose_1.default.Types.ObjectId(memberId));
    const memberObjectId = new mongoose_1.default.Types.ObjectId(memberId);
    console.log('Members in groups:', group.members);
    // Compare ObjectIds as strings
    const memberExists = group.members.some((m) => m["_id"].toString() === memberObjectId.toString());
    if (!memberExists) {
        throw new Error('Member is not in the group');
    }
    return await group_modal_1.default.findByIdAndUpdate(groupId, { $pull: { members: memberObjectId } }, { new: true }).populate('members', 'name email profilePicture');
};
exports.removeMemberFromGroup = removeMemberFromGroup;
const getGroupUsers = async (groupId, search = '', page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const matchRegex = new RegExp(search, 'i');
    const group = await group_modal_1.default.findById(groupId).lean();
    if (!group) {
        throw new Error('Group not found');
    }
    const pipeline = [
        {
            $match: {
                _id: { $in: group.members },
                ...(search && {
                    $or: [{ name: { $regex: matchRegex } }, { email: { $regex: matchRegex } }],
                }),
            },
        },
        {
            $facet: {
                members: [{ $skip: skip }, { $limit: limit }],
                total: [{ $count: 'count' }],
            },
        },
    ];
    const result = await user_model_1.default.aggregate(pipeline);
    const members = result[0]?.members || [];
    const total = result[0]?.total[0]?.count || 0;
    return {
        group,
        members,
        total,
        page,
        limit,
    };
};
exports.getGroupUsers = getGroupUsers;

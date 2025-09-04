"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupMembersController = exports.removeMemberFromGroupController = exports.addMemberToGroupController = exports.getGroupNamesController = exports.getWorkspaceGroupsController = exports.deleteGroupController = exports.updateGroupController = exports.getGroupController = exports.createGroupController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const group_service_1 = require("./group.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.createGroupController = (0, catchAsync_1.default)(async (req, res) => {
    const group = await (0, group_service_1.CreateGroup)({ ...req.body, createdBy: req.user._id });
    res.status(http_status_1.default.CREATED).json({
        success: true,
        data: group,
        message: 'Group created successfully',
    });
});
exports.getGroupController = (0, catchAsync_1.default)(async (req, res) => {
    const group = await (0, group_service_1.getGroupById)(req.params['groupId'] || '');
    res.status(http_status_1.default.OK).json({
        success: true,
        data: group,
        message: 'Group retrieved successfully',
    });
});
exports.updateGroupController = (0, catchAsync_1.default)(async (req, res) => {
    const groupId = req.params['groupId'] || '';
    const updatedGroup = await (0, group_service_1.updateGroup)(groupId, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: updatedGroup,
        message: 'Group updated successfully',
    });
});
exports.deleteGroupController = (0, catchAsync_1.default)(async (req, res) => {
    const groupId = req.params['groupId'] || '';
    const deletedGroup = await (0, group_service_1.deleteGroup)(groupId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: deletedGroup,
        message: 'Group deleted successfully',
    });
});
exports.getWorkspaceGroupsController = (0, catchAsync_1.default)(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const body = {
        workspace: req.params['workspaceId'],
        search: search,
        page: Number(page),
        limit: Number(limit),
    };
    console.log('Fetching groups for workspace:', body);
    const groups = await (0, group_service_1.getGroupsByWorkspace)(body);
    res.status(http_status_1.default.OK).json(groups);
});
exports.getGroupNamesController = (0, catchAsync_1.default)(async (req, res) => {
    const workspaceId = req.params['workspaceId'] || '';
    const groupNames = await (0, group_service_1.getGroupsNames)(workspaceId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: groupNames,
        message: 'Group names retrieved successfully',
    });
});
exports.addMemberToGroupController = (0, catchAsync_1.default)(async (req, res) => {
    const groupId = req.params['groupId'] || '';
    const memberId = req.body.memberId; // Assuming memberId is passed in the request body
    if (!memberId) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Member ID is required',
        });
    }
    const updatedGroup = await (0, group_service_1.addMemberToGroup)(groupId, memberId);
    return res.status(http_status_1.default.OK).json({
        success: true,
        data: updatedGroup,
        message: 'Member added to group successfully',
    });
});
exports.removeMemberFromGroupController = (0, catchAsync_1.default)(async (req, res) => {
    const groupId = req.params['groupId'] || '';
    const memberId = req.params['memberId'] || ''; // Assuming memberId is passed in the request params
    if (!memberId) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Member ID is required',
        });
    }
    const updatedGroup = await (0, group_service_1.removeMemberFromGroup)(groupId, memberId);
    return res.status(http_status_1.default.OK).json({
        success: true,
        data: updatedGroup,
        message: 'Member removed from group successfully',
    });
});
exports.getGroupMembersController = (0, catchAsync_1.default)(async (req, res) => {
    const groupId = req.params['groupId'] || '';
    const search = req.query['search'] || '';
    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 10;
    const members = await (0, group_service_1.getGroupUsers)(groupId, search, page, limit);
    res.status(http_status_1.default.OK).json(members);
});

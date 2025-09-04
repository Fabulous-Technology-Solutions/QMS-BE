import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  CreateGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupsByWorkspace,
  getGroupsNames,
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupUsers,
} from './group.service';
import catchAsync from '../../utils/catchAsync';


export const createGroupController = catchAsync(async (req: Request, res: Response) => {
  const group = await CreateGroup({ ...req.body, createdBy: req.user._id });
  res.status(httpStatus.CREATED).json({
    success: true,
    data: group,
    message: 'Group created successfully',
  });
});

export const getGroupController = catchAsync(async (req: Request, res: Response) => {
  const group = await getGroupById(req.params['groupId'] || '');
  res.status(httpStatus.OK).json({
    success: true,
    data: group,
    message: 'Group retrieved successfully',
  });
});

export const updateGroupController = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.params['groupId'] || '';
  const updatedGroup = await updateGroup(groupId, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    data: updatedGroup,
    message: 'Group updated successfully',
  });
});

export const deleteGroupController = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.params['groupId'] || '';
  const deletedGroup = await deleteGroup(groupId);

  res.status(httpStatus.OK).json({
    success: true,
    data: deletedGroup,
    message: 'Group deleted successfully',
  });
});

export const getWorkspaceGroupsController = catchAsync(async (req: Request, res: Response) => {
  const { search, page = 1, limit = 10 } = req.query;
  const body = {
    workspace: req.params['workspaceId'] as string,
    search: search as string,
    page: Number(page),
    limit: Number(limit),
  };
  console.log('Fetching groups for workspace:', body);

  const groups = await getGroupsByWorkspace(body);

  res.status(httpStatus.OK).json(groups);
});

export const getGroupNamesController = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params['workspaceId'] || '';
  const groupNames = await getGroupsNames(workspaceId);

  res.status(httpStatus.OK).json({
    success: true,
    data: groupNames,
    message: 'Group names retrieved successfully',
  });
});

export const addMemberToGroupController = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.params['groupId'] || '';
  const memberId = req.body.memberId; // Assuming memberId is passed in the request body

  if (!memberId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Member ID is required',
    });
  }

  const updatedGroup = await addMemberToGroup(groupId, memberId);

  return res.status(httpStatus.OK).json({
    success: true,
    data: updatedGroup,
    message: 'Member added to group successfully',
  });
});

export const removeMemberFromGroupController = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.params['groupId'] || '';
  const memberId = req.params['memberId'] || ''; // Assuming memberId is passed in the request params

  if (!memberId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Member ID is required',   
    });
  }

  const updatedGroup = await removeMemberFromGroup(groupId, memberId as string);

  return res.status(httpStatus.OK).json({
    success: true,
    data: updatedGroup,
    message: 'Member removed from group successfully',
  });
});

export const getGroupMembersController = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.params['groupId'] || '';
  const search = (req.query['search'] as string) || '';
  const page = req.query['page'] ? Number(req.query['page']) : 1;
  const limit = req.query['limit'] ? Number(req.query['limit']) : 10;
  const members = await getGroupUsers(groupId, search, page, limit);
  res.status(httpStatus.OK).json(members);
});

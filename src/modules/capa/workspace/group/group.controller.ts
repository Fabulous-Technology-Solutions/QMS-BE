import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateGroup, getGroupById, updateGroup, deleteGroup, getGroupsByWorkspace, getGroupsNames } from './group.service';
import catchAsync from '../../../utils/catchAsync';

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
    workspace: req.params["workspaceId"] as string,
    search: search as string,
    page: Number(page),
    limit: Number(limit),
  };

  const groups = await getGroupsByWorkspace(body);

  res.status(httpStatus.OK).json({
    success: true,
    data: groups,
    message: 'Groups retrieved successfully',
  });
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

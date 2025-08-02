import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';

import {
  deleteWorkspaceUser,
  createWorkspaceUser,
  getWorkspaceUsers,
  updateWorkspaceUser,
  getSingleWorkspaceUser,
  getworkspaceusersnames,
} from './workspaceUser.service';


const createWorkspaceUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await createWorkspaceUser(req.body);
  res.status(201).json({
    success: true,
    message: 'Workspace user created successfully',
    data: user,
  });
});

const updateWorkspaceUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await updateWorkspaceUser(req.params['userId'] as string, req.body);
  res.status(200).json({
    success: true,
    message: 'Workspace user updated successfully',
    data: user,
  });
});

const deleteWorkspaceUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await deleteWorkspaceUser(req.params['userId'] as string);
  res.status(200).json({
    success: true,
    message: 'Workspace user deleted successfully',
    data: user,
  });
});
const getWorkspaceUsersController = catchAsync(async (req: Request, res: Response) => {
  const users = await getWorkspaceUsers(
    req.params['workspaceId'] as string,
    Number(req.query['page']) || 1,
    Number(req.query['limit']) || 10,
    req.query['search'] as string
  );
  res.status(200).json({
    success: true,
    message: 'Workspace users retrieved successfully',
    data: users,
  });
});

const getSingleWorkspaceUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await getSingleWorkspaceUser(req.params['userId'] as string);
  res.status(200).json({
    success: true,
    message: 'Workspace user retrieved successfully',
    data: user,
  });
});

const getworkspacegroupsNamesController = catchAsync(async (req: Request, res: Response) => {
  const users = await getworkspaceusersnames(req.params['workspaceId'] as string);
  res.status(200).json({
    success: true,
    message: 'Workspace users names retrieved successfully',
    data: users,
  });
});



export {
  createWorkspaceUserController,
  updateWorkspaceUserController,
  deleteWorkspaceUserController,
  getWorkspaceUsersController,
  getSingleWorkspaceUserController,
  getworkspacegroupsNamesController
};

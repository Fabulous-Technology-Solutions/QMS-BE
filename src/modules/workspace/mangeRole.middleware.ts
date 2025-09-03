import catchAsync from '../utils/catchAsync';
import { NextFunction, Request } from 'express';
import { checkAdminBelongsToWorkspace, checkWorkSubadminBelongsToWorkspace } from '../capa/workspace/manageRole/manageRole.service';
import CapaworkspaceModel from './workspace.modal';
import AppiError from '../errors/ApiError';
import httpStatus from 'http-status';

const checkCreateRole = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  const { user } = req;
  if (user.role === 'admin') {
    await checkAdminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
  } else if (user.role === 'subadmin') {
    await checkWorkSubadminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
  } else if (user.role === 'workspaceUser') {
    console.log(req.params['workspaceId'],"well....................");
    if ((req.params['workspaceId'] || req.body.workspace) !== user['workspace']?.toString()) {
      throw new Error('Unauthorized role for performing this action');
    }
    const findworkspace = await CapaworkspaceModel.findOne({
      _id: req.params['workspaceId'] || req.body.workspace,               
      isDeleted: false,
    });
    if (!findworkspace) {
      throw new AppiError('Workspace not found', httpStatus.NOT_FOUND);
    }
  } else {
    throw new Error('Unauthorized role for creating a role');
  }
  next();
});

export default checkCreateRole;

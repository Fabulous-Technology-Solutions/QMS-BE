import catchAsync from '../../../utils/catchAsync';
import { NextFunction, Request } from 'express';
import { checkAdminBelongsToWorkspace, checkWorkSubadminBelongsToWorkspace } from './manageRole.service';

const checkCreateRole = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  const { user } = req;
  console.log('Checking create role permissions.......................', req.params['workspaceId']);
  if (user.role === 'admin') {
    await checkAdminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
  } else if (user.role === 'subadmin') {
    await checkWorkSubadminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
  } else if (user.role === 'workspaceUser') {
    if ((req.params['workspaceId'] || req.body.workspace) !== user['workspace']?.toString()) {
      throw new Error('Unauthorized role for performing this action');
    }
  } else {
    throw new Error('Unauthorized role for creating a role');
  }
  next();
});

export default checkCreateRole;

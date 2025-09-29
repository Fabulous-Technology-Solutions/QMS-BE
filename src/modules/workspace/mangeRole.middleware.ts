import catchAsync from '../utils/catchAsync';
import { NextFunction, Request } from 'express';
import { checkAdminBelongsToWorkspace } from './manageRole/manageRole.service';

const checkCreateRole = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  const { user } = req;
 
  if (!req.headers['accountid']) {
    await checkAdminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
  }
  next();
});

export default checkCreateRole;

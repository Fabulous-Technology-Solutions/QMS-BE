import catchAsync from '../utils/catchAsync';
import { NextFunction, Request } from 'express';
import { checkAdminBelongsToWorkspace } from './manageRole/manageRole.service';
import { accountServices } from '../account';

const checkCreateRole = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  const { user } = req;
  if (req.headers['accountId']) {
    await accountServices.checkUserBelongsToAccount(
      user._id.toString(),
      req.headers['accountId'] as string,
      req.params['workspaceId'] || req.body.workspace
    );
  } else {
    await checkAdminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
  }
  next();
});

export default checkCreateRole;

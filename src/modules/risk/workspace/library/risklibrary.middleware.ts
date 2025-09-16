import catchAsync from '../../../utils/catchAsync';
import { NextFunction, Request } from 'express';

import { checkSubAdminBelongsToLibrary,checkAdminBelongsTtoLibrary, checkUserBelongsToLibrary } from './risklibrary.service';
const checkValidation = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  const { user } = req;
  if (user.role === 'admin') {
    await checkAdminBelongsTtoLibrary(req.params['libraryId'] || req.body.library,user._id);
  } else if (user.role === 'subadmin') {  
    await checkSubAdminBelongsToLibrary(req.params['libraryId'] || req.body.library,user._id,req.headers["datatype"] as string);
  } else if (user.role === 'workspaceUser') {
     await checkUserBelongsToLibrary(req.params['libraryId'] || req.body.library, user, req.headers["datatype"] as string);
  } else {
    throw new Error('Unauthorized role for creating a role');
  }
  next();
});

export default checkValidation;

import catchAsync from '../../../utils/catchAsync';
import { NextFunction, Request } from 'express';

import { checkSubAdminBelongsToLibrary,checkAdminBelongsTtoLibrary, checkUserBelongsToLibrary } from './capalibrary.service';
const checkValidation = catchAsync(async (req: Request, _: Response, next: NextFunction) => {


  console.log('Checking action permissions.......................', req.params['libraryId'],"and", req.body.library);
  const { user } = req;
  if (user.role === 'admin') {
    await checkAdminBelongsTtoLibrary(req.params['libraryId'] || req.body.library,user._id,);
  } else if (user.role === 'subadmin') {
    await checkSubAdminBelongsToLibrary(req.params['libraryId'] || req.body.library,user._id);
  } else if (user.role === 'workspaceUser') {
     await checkUserBelongsToLibrary(req.params['libraryId'] || req.body.library, user);
  } else {
    throw new Error('Unauthorized role for creating a role');
  }
  next();
});

export default checkValidation;

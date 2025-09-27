import catchAsync from '../../../utils/catchAsync';
import { NextFunction, Request } from 'express';

import { checkAdminBelongsTtoLibrary} from './risklibrary.service';
import { accountServices } from '../../../account';
const checkValidation = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  const { user } = req;
  if(req.headers['accountId']){
    await accountServices.findUserBelongToRiskLibrary(
      user._id.toString(),
      req.headers['accountId'] as string,
      req.params['libraryId'] || req.body.library
    );
  }else{
    await checkAdminBelongsTtoLibrary(req.params['libraryId'] || req.body.library,user._id);
  }


  next();
});

export default checkValidation;

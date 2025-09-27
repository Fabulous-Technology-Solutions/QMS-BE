
import { Router } from 'express';

import { auth } from '../../modules/auth';
import {accountController, accountValidation } from '../../modules/account';
import { validate } from '../../modules/validate';

const router = Router();
router
  .route('/:accountId')
  .get(auth(), accountController.getAccountById)
  .delete(auth(), accountController.deleteAccount)
  .put(auth(), validate(accountValidation.updateAccountValidationSchema), accountController.updateAccount);

router
  .route('/globalaccounts/:accountId')
  .get(auth(), accountController.getAllAccounts); 
router
  .route('/switchaccount/:accountId')
  .get(auth(), accountController.switchAccountController); 

export default router;

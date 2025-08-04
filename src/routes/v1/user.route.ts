import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { userController, userValidation } from '../../modules/user';
import { activityLoggerMiddleware } from '../../modules/activitylogs/activitylogs.middleware';
const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), activityLoggerMiddleware, userController.createUser)
  .get(auth('manageUsers'), validate(userValidation.getUsers), userController.getAllUsers);
  // .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router.get('/me', auth(), userController.getMe);


router
  .route('/:userId')
  .get(auth('manageUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), activityLoggerMiddleware, userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), activityLoggerMiddleware, userController.deleteUser);

export default router;


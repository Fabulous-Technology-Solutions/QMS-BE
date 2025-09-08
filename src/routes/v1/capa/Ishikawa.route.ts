import {
    IshikawaController,
    IshikawaValidation
} from '../../../modules/capa/workspace/capalibrary/Ishikawa';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/capa/workspace/capalibrary/capalibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();

router
    .route('/')
    .post(auth('createIshikawa'), checkValidation, validate(IshikawaValidation.CreateIshikawaSchema), activityLoggerMiddleware, IshikawaController.create);

router
    .route('/libraries/:libraryId/ishikawa/:id')
    .get(auth('getIshikawa'), checkValidation, IshikawaController.getById)
    .delete(auth('deleteIshikawa'), checkValidation, activityLoggerMiddleware, IshikawaController.delete);

router
    .route('/libraries/:libraryId/ishikawa')
    .get(auth('getIshikawaByLibrary'), checkValidation, IshikawaController.getByLibrary);

export default router;

import {
    IshikawaController,
    IshikawaValidation
} from '../../../modules/risk/workspace/library/Ishikawa';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();

router
    .route('/')
    .post(auth('Risk_createIshikawa'), checkValidation, validate(IshikawaValidation.CreateIshikawaSchema), activityLoggerMiddleware, IshikawaController.create);

router
    .route('/libraries/:libraryId/ishikawa/:id')
    .get(auth('Risk_getIshikawa'), checkValidation, IshikawaController.getById)
    .delete(auth('Risk_deleteIshikawa'), checkValidation, activityLoggerMiddleware, IshikawaController.delete);

router
    .route('/libraries/:libraryId/ishikawa')
    .get(auth('Risk_getIshikawaByLibrary'), checkValidation, IshikawaController.getByLibrary);

export default router;

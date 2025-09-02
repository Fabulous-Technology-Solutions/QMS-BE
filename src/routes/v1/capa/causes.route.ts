import {causeController,  causeValidation} from '../../../modules/capa/workspace/capalibrary/causes';
import  { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/capa/workspace/capalibrary/capalibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();
router
    .route('/')
    .post(auth('createCauses'), checkValidation, validate(causeValidation.createCausesSchema), activityLoggerMiddleware, causeController.createCause)
router
    .route('/libraries/:libraryId/cause/:causeId')
    .get(auth('getCause'), checkValidation, causeController.getCauseById)
    .patch(auth('updateCause'), checkValidation, validate(causeValidation.updateCausesSchema), activityLoggerMiddleware, causeController.updateCause)
    .delete(auth('deleteCause'), checkValidation, activityLoggerMiddleware, causeController.deleteCause);

router
    .route('/libraries/:libraryId/causes')
    .get(auth('getCauses'), checkValidation, causeController.getCausesByLibrary)
router
    .route('/libraries/:libraryId/causes/names')
    .get(auth('getCausesNames'), checkValidation, causeController.getCausesNamesByLibrary);

export default router;
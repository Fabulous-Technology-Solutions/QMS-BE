import {causeController,  causeValidation} from '../../../modules/risk/workspace/library/causes';
import  { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();
router
    .route('/')
    .post(auth('createCauses'), checkValidation, validate(causeValidation.createCausesSchema), activityLoggerMiddleware, causeController.create)
router
    .route('/libraries/:libraryId/cause/:causeId')
    .get(auth('getCause'), checkValidation, causeController.getById)
    .patch(auth('updateCause'), checkValidation, validate(causeValidation.updateCausesSchema), activityLoggerMiddleware, causeController.update)
    .delete(auth('deleteCause'), checkValidation, activityLoggerMiddleware, causeController.delete);

router
    .route('/libraries/:libraryId/causes')
    .get(auth('getCauses'), checkValidation, causeController.getByLibrary)
router
    .route('/libraries/:libraryId/causes/names')
    .get(auth('getCausesNames'), checkValidation, causeController.getNamesByLibrary);

export default router;
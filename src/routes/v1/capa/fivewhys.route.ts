import { FiveWhysController, FiveWhyValidation } from '../../../modules/capa/workspace/capalibrary/fivewhys';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/capa/workspace/capalibrary/capalibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();
router
    .route('/')
    .post(auth('createFiveWhys'), checkValidation, validate(FiveWhyValidation.CreateFiveWhysRequestSchema), activityLoggerMiddleware, FiveWhysController.create);

router
    .route('/libraries/:libraryId/fivewhys/:fivewhysid')
    .get(auth('getFiveWhys'), checkValidation, FiveWhysController.getById)
    .patch(auth('updateFiveWhys'), checkValidation, validate(FiveWhyValidation.UpdateFiveWhysRequestSchema), activityLoggerMiddleware, FiveWhysController.update)
    .delete(auth('deleteFiveWhys'), checkValidation, activityLoggerMiddleware, FiveWhysController.delete);

router
    .route('/libraries/:libraryId/fivewhys')
    .get(auth('getFiveWhysByLibrary'), checkValidation, FiveWhysController.getByLibrary);

export default router;

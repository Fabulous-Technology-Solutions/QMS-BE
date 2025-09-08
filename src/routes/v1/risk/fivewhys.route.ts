import { FiveWhysController, FiveWhyValidation } from '../../../modules/risk/workspace/library/fivewhys';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();
router
    .route('/')
    .post(auth('Risk_createFiveWhys'), checkValidation, validate(FiveWhyValidation.CreateFiveWhysRequestSchema), activityLoggerMiddleware, FiveWhysController.create);

router
    .route('/libraries/:libraryId/fivewhys/:fivewhysid')
    .get(auth('Risk_getFiveWhys'), checkValidation, FiveWhysController.getById)
    .patch(auth('Risk_updateFiveWhys'), checkValidation, validate(FiveWhyValidation.UpdateFiveWhysRequestSchema), activityLoggerMiddleware, FiveWhysController.update)
    .delete(auth('Risk_deleteFiveWhys'), checkValidation, activityLoggerMiddleware, FiveWhysController.delete);

router
    .route('/libraries/:libraryId/fivewhys')
    .get(auth('Risk_getFiveWhysByLibrary'), checkValidation, FiveWhysController.getByLibrary);

export default router;

import { controlController, controlValidation } from '../../../modules/risk/workspace/library/control';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();
router
  .route('/')
  .post(
    auth('createControl'),
    checkValidation,
    validate(controlValidation.createControlSchema),
    activityLoggerMiddleware,
    controlController.createControl
  );
router
  .route('/libraries/:libraryId/control/:id')
  .get(auth('getControl'), checkValidation, controlController.getControlById)
  .patch(
    auth('updateControl'),
    checkValidation,
    validate(controlValidation.updateControlSchema),
    activityLoggerMiddleware,
    controlController.updateControl
  )
  .delete(auth('deleteControl'), checkValidation, activityLoggerMiddleware, controlController.deleteControl);

router.route('/libraries/:libraryId').get(auth('getControls'), checkValidation, controlController.getAllControls);

export default router;

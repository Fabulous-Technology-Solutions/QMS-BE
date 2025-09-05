import { ConsequenceController, ConsequenceValidation } from '../../../modules/risk/workspace/library/consequence';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';
const router: Router = Router();
router
  .route('/')
  .post(
    auth('createConsequence'),
    checkValidation,
    validate(ConsequenceValidation.createConsequenceValidationSchema),
    activityLoggerMiddleware,
    ConsequenceController.createConsequence
  );
router
  .route('/libraries/:libraryId/consequence/:id')
  .get(auth('getConsequence'), checkValidation, ConsequenceController.getConsequence)
  .patch(
    auth('updateConsequence'),
    checkValidation,
    validate(ConsequenceValidation.updateConsequenceValidationSchema),
    activityLoggerMiddleware,
    ConsequenceController.updateConsequence
  )
  .delete(auth('deleteConsequence'), checkValidation, activityLoggerMiddleware, ConsequenceController.deleteConsequence);

router.route('/libraries/:libraryId').get(auth('getConsequences'), checkValidation, ConsequenceController.getConsequences);

export default router;

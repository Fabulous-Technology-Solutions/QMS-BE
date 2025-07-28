import {causeController,  causeValidation} from '../../modules/capa/workspace/capalibrary/causes';
import  { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkValidation from '../../modules/capa/workspace/capalibrary/capalibrary.middleware';
const router: Router = Router();
router
    .route('/')
    .post(auth('createCauses'), checkValidation, validate(causeValidation.createCausesSchema), causeController.createCause)
router
    .route('/libraries/:libraryId/cause/:causeId')
    .get(auth('getCause'), checkValidation, causeController.getCauseById)
    .put(auth('updateCause'), checkValidation, validate(causeValidation.updateCausesSchema), causeController.updateCause)
    .delete(auth('deleteCause'), checkValidation, causeController.deleteCause);

router
    .route('/libraries/:libraryId/causes')
    .get(auth('getCauses'), checkValidation, causeController.getCausesByLibrary)
    
export default router;
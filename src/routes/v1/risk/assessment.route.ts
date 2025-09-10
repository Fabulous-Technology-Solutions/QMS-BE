import express, { Router } from 'express';
import {  
    AssessmentValidation,
    AssessmentController
 } from '../../../modules/risk/workspace/library/assessment';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';
import checkValidation from '../../../modules/risk/workspace/library/risklibrary.middleware';
import { activityLoggerMiddleware } from '../../../modules/activitylogs/activitylogs.middleware';


const router: Router = express.Router();
router.post(
  '/',
  auth('risk_createAssessment'),
  checkValidation,
  validate(AssessmentValidation.createAssessmentSchema),
  activityLoggerMiddleware,
  AssessmentController.create
);
router.get('/libraries/:libraryId', auth('risk_getAssessmentsByLibrary'), checkValidation, AssessmentController.getByLibrary);
router.get('/libraries/:libraryId/assessment/:assessmentId', auth('risk_getSingleAssessment'), checkValidation, AssessmentController.getById);
router.patch('/libraries/:libraryId/assessment/:assessmentId', auth('risk_updateAssessment'), checkValidation,  validate(AssessmentValidation.updateAssessmentSchema), activityLoggerMiddleware, AssessmentController.update);
router.delete('/libraries/:libraryId/assessment/:assessmentId',  auth('risk_deleteAssessment'), checkValidation, activityLoggerMiddleware, AssessmentController.deleteObj);

export default router;
       
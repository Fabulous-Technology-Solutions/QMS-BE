import { ChecklistController, ValidationChecklist } from '../../../modules/capa/workspace/checklist';
import { Router } from 'express';
import { validate } from '../../../modules/validate';
import { auth } from '../../../modules/auth';

import checkCreateRole from '../../../modules/capa/workspace/mangeRole.middleware';
const router: Router = Router();

router
  .route('/')
  .post(
    auth('createChecklist'),
    checkCreateRole,
    validate(ValidationChecklist.checkListValidationSchema),
    ChecklistController.createChecklist
  );

router
  .route('/workspace/:workspaceId/checklist/:checklistId')
  .get(auth('getChecklist'), checkCreateRole, ChecklistController.getChecklistById)
  .patch(
    auth('updateChecklist'),
    checkCreateRole,
    validate(ValidationChecklist.checkListUpdateValidationSchema),
    ChecklistController.updateChecklist
  )
  .delete(auth('deleteChecklist'), checkCreateRole, ChecklistController.deleteChecklist);

router
  .route('/workspace/:workspaceId')
  .get(auth('getChecklists'), checkCreateRole, ChecklistController.getChecklistsByWorkspaceId);

router
  .route('/workspace/:workspaceId/names')
  .get(auth('getChecklistNames'), checkCreateRole, ChecklistController.getChecklistNames);

export default router;

import {itemValidation, itemController} from '../../modules/capa/workspace/checklist/item';
import  { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkCreateRole from '../../modules/capa/workspace/mangeRole.middleware';
const router: Router = Router();

router
    .route('/')
    .post(auth('createChecklistItem'), validate(itemValidation.CreateItem), itemController.createChecklistItem);

router
    .route('/workspace/:workspaceId/items/:itemId')
    .get(auth('getChecklistItem'), checkCreateRole,itemController.getChecklistItemById)
    .patch(auth('updateChecklistItem'), checkCreateRole, itemController.updateChecklistItem)
    .delete(auth('deleteChecklistItem'), checkCreateRole,itemController.deleteChecklistItem);

router
    .route('/workspace/:workspaceId/checklist/:checklistId/items')
    .get(auth('getChecklistItems'), checkCreateRole,itemController.getChecklistItemsByChecklistId);

export default router;
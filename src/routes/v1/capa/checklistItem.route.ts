import { itemController} from '../../../modules/capa/workspace/checklist/item';
import  { Router } from 'express';
import { auth } from '../../../modules/auth';
import checkCreateRole from '../../../modules/workspace/mangeRole.middleware';
const router: Router = Router();

router
    .route('/')
    .post(auth('createChecklistItem'), itemController.createChecklistItem);

router
    .route('/workspace/:workspaceId/items/:itemId')
    .delete(auth('deleteChecklistItem'), checkCreateRole,itemController.deleteChecklistItem);

    router
    .route('/workspace/:workspaceId/items').patch(auth('updateChecklistItem'), checkCreateRole, itemController.updateChecklistItem)
router
    .route('/workspace/:workspaceId/checklist/:checklistId/items')
    .get(auth('getChecklistItems'), checkCreateRole,itemController.getChecklistItemsByChecklistId);

export default router;
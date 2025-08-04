

import { Router } from 'express';
import { getLogsByIdController } from '../../modules/activitylogs/activitylogs.controller';
import { auth } from '../../modules/auth';

const router = Router();

router.get('/:id', auth("getlogs"), getLogsByIdController);

export default router;

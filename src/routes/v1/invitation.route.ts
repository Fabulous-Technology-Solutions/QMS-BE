
import { Router } from 'express';
import { auth } from '../../modules/auth';
import {invitationController,invitationValidation} from '../../modules/invitation';
import { validate } from '../../modules/validate';
const router = Router();
router.post('/accept', auth(),  invitationController.acceptInvitation);
router.post('/', auth(), validate(invitationValidation.invitationValidationSchema),invitationController.createInvitation).get('/', auth(), invitationController.getInvitations);
router.get('/:token', auth(), invitationController.getInvitationByToken);
router.delete('/:token', auth(), invitationController.deleteInvitation);

export default router;

import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { notificationSettingController, notificationValidation } from '../../modules/workspace/notificationSetting';

const router: Router = express.Router();
router
  .route('/')
  .post(
    auth('createNotificationSetting'),
    validate(notificationValidation.createOrUpdateNotificationSettingValidation),
    notificationSettingController.createOrUpdateNotificationSettingHandler
  );
router
  .route('/:workspaceId')
  .put(
    auth('updateNotificationSetting'),
    validate(notificationValidation.updateNotificationSettingValidation),
    notificationSettingController.updateNotificationSettingHandler
  )
  .delete(
    auth('deleteNotificationSetting'),

    notificationSettingController.deleteNotificationSettingHandler
  );
router.route('/:workspaceId').get(
  auth('getNotificationSetting'),
  notificationSettingController.getNotificationSettingByWorkspaceIdHandler
);
export default router;

import
 {createOrUpdateNotificationSetting,
  getNotificationSettingByWorkspaceId,
  updateNotificationSetting,
  deleteNotificationSetting
} from './notificationSetting.services.js';

import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync.js';

export const createOrUpdateNotificationSettingHandler = catchAsync(async (req: Request, res: Response) => {

  const result = await createOrUpdateNotificationSetting(req.body);
  res.status(200).json({ success: true, data: result });
});
export const getNotificationSettingByWorkspaceIdHandler = catchAsync(async (req: Request, res: Response) => {
 const workspaceId = req.params['workspaceId'];
  const result = await getNotificationSettingByWorkspaceId(workspaceId as string);
  res.status(200).json({ success: true, data: result });
});

export const updateNotificationSettingHandler = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params['workspaceId'];
  const result = await updateNotificationSetting(workspaceId as string, req.body);
  res.status(200).json({ success: true, data: result });
});
export const deleteNotificationSettingHandler = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params['workspaceId'];
  const result = await deleteNotificationSetting(workspaceId as string);
  res.status(200).json({ success: true, data: result });
}
);

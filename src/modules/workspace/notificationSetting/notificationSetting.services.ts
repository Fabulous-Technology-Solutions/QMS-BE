import mongoose from 'mongoose';
import { INotificationSettingResponse } from './notificationSetting.interfaces.js';
import NotificationSettingModal from './notificationSetting.modal.js';

export const createOrUpdateNotificationSetting = async (data: INotificationSettingResponse) => {
  const { workspaceId } = data;
  let setting = await NotificationSettingModal.findOne({ workspaceId: workspaceId });
  if (setting) {
    Object.assign(setting, data);
    return await setting.save();
  } else {
    const newSetting = new NotificationSettingModal(data);
    return await newSetting.save();
  }
};

export const getNotificationSettingByWorkspaceId = async (
  workspaceId: string
): Promise<INotificationSettingResponse | null> => {
  return await NotificationSettingModal.findOne({ workspaceId: new mongoose.Types.ObjectId(workspaceId) });
};

export const updateNotificationSetting = async (workspaceId: string, data: Partial<INotificationSettingResponse>) => {
  const setting = await NotificationSettingModal.findOne({ workspaceId: new mongoose.Types.ObjectId(workspaceId) });
  if (setting) {
    Object.assign(setting, data);
    return await setting.save();
  } else {
    return await createOrUpdateNotificationSetting({
      workspaceId: workspaceId,
      ...data,
    });
  }
};
export const deleteNotificationSetting = async (workspaceId: string) => {
  return await NotificationSettingModal.findOneAndDelete({ workspaceId: new mongoose.Types.ObjectId(workspaceId) });
};

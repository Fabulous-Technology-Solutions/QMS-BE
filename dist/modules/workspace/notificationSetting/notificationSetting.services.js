"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotificationSetting = exports.updateNotificationSetting = exports.getNotificationSettingByWorkspaceId = exports.createOrUpdateNotificationSetting = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSetting_modal_js_1 = __importDefault(require("./notificationSetting.modal.js"));
const createOrUpdateNotificationSetting = async (data) => {
    const { workspaceId } = data;
    let setting = await notificationSetting_modal_js_1.default.findOne({ workspaceId: workspaceId });
    if (setting) {
        Object.assign(setting, data);
        return await setting.save();
    }
    else {
        const newSetting = new notificationSetting_modal_js_1.default(data);
        return await newSetting.save();
    }
};
exports.createOrUpdateNotificationSetting = createOrUpdateNotificationSetting;
const getNotificationSettingByWorkspaceId = async (workspaceId) => {
    return await notificationSetting_modal_js_1.default.findOne({ workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId) });
};
exports.getNotificationSettingByWorkspaceId = getNotificationSettingByWorkspaceId;
const updateNotificationSetting = async (workspaceId, data) => {
    const setting = await notificationSetting_modal_js_1.default.findOne({ workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId) });
    if (setting) {
        Object.assign(setting, data);
        return await setting.save();
    }
    else {
        return await (0, exports.createOrUpdateNotificationSetting)({
            workspaceId: workspaceId,
            ...data,
        });
    }
};
exports.updateNotificationSetting = updateNotificationSetting;
const deleteNotificationSetting = async (workspaceId) => {
    return await notificationSetting_modal_js_1.default.findOneAndDelete({ workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId) });
};
exports.deleteNotificationSetting = deleteNotificationSetting;

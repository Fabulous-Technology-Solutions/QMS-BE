"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotificationSettingHandler = exports.updateNotificationSettingHandler = exports.getNotificationSettingByWorkspaceIdHandler = exports.createOrUpdateNotificationSettingHandler = void 0;
const notificationSetting_services_js_1 = require("./notificationSetting.services.js");
const catchAsync_js_1 = __importDefault(require("../../utils/catchAsync.js"));
exports.createOrUpdateNotificationSettingHandler = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await (0, notificationSetting_services_js_1.createOrUpdateNotificationSetting)(req.body);
    res.status(200).json({ success: true, data: result });
});
exports.getNotificationSettingByWorkspaceIdHandler = (0, catchAsync_js_1.default)(async (req, res) => {
    const workspaceId = req.params['workspaceId'];
    const result = await (0, notificationSetting_services_js_1.getNotificationSettingByWorkspaceId)(workspaceId);
    res.status(200).json({ success: true, data: result });
});
exports.updateNotificationSettingHandler = (0, catchAsync_js_1.default)(async (req, res) => {
    const workspaceId = req.params['workspaceId'];
    const result = await (0, notificationSetting_services_js_1.updateNotificationSetting)(workspaceId, req.body);
    res.status(200).json({ success: true, data: result });
});
exports.deleteNotificationSettingHandler = (0, catchAsync_js_1.default)(async (req, res) => {
    const workspaceId = req.params['workspaceId'];
    const result = await (0, notificationSetting_services_js_1.deleteNotificationSetting)(workspaceId);
    res.status(200).json({ success: true, data: result });
});

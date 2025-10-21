"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const notificationSetting_1 = require("../../modules/workspace/notificationSetting");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)('createNotificationSetting'), (0, validate_1.validate)(notificationSetting_1.notificationValidation.createOrUpdateNotificationSettingValidation), notificationSetting_1.notificationSettingController.createOrUpdateNotificationSettingHandler);
router
    .route('/:workspaceId')
    .put((0, auth_1.auth)('updateNotificationSetting'), (0, validate_1.validate)(notificationSetting_1.notificationValidation.updateNotificationSettingValidation), notificationSetting_1.notificationSettingController.updateNotificationSettingHandler)
    .delete((0, auth_1.auth)('deleteNotificationSetting'), notificationSetting_1.notificationSettingController.deleteNotificationSettingHandler);
router.route('/:workspaceId').get((0, auth_1.auth)('getNotificationSetting'), notificationSetting_1.notificationSettingController.getNotificationSettingByWorkspaceIdHandler);
exports.default = router;

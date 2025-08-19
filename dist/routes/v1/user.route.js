"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const user_1 = require("../../modules/user");
const activitylogs_middleware_1 = require("../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)('manageUsers'), (0, validate_1.validate)(user_1.userValidation.createUser), activitylogs_middleware_1.activityLoggerMiddleware, user_1.userController.createUser)
    .get((0, auth_1.auth)('manageUsers'), (0, validate_1.validate)(user_1.userValidation.getUsers), user_1.userController.getAllUsers);
// .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);
router.get('/me', (0, auth_1.auth)(), user_1.userController.getMe);
router
    .route('/:userId')
    .get((0, auth_1.auth)('manageUsers'), (0, validate_1.validate)(user_1.userValidation.getUser), user_1.userController.getUser)
    .patch((0, auth_1.auth)('manageUsers'), (0, validate_1.validate)(user_1.userValidation.updateUser), activitylogs_middleware_1.activityLoggerMiddleware, user_1.userController.updateUser)
    .delete((0, auth_1.auth)('manageUsers'), (0, validate_1.validate)(user_1.userValidation.deleteUser), activitylogs_middleware_1.activityLoggerMiddleware, user_1.userController.deleteUser);
exports.default = router;

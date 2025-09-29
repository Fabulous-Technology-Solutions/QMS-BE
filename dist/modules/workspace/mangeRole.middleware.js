"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const manageRole_service_1 = require("./manageRole/manageRole.service");
const checkCreateRole = (0, catchAsync_1.default)(async (req, _, next) => {
    const { user } = req;
    if (!req.headers['accountid']) {
        await (0, manageRole_service_1.checkAdminBelongsToWorkspace)(user._id, req.params['workspaceId'] || req.body.workspace);
    }
    next();
});
exports.default = checkCreateRole;

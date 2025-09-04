"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const roles_1 = require("../../config/roles");
const manageRole_service_1 = require("../workspace/manageRole/manageRole.service");
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    console.log('Authentication attempt:', req.headers.authorization);
    if (err || info || !user) {
        return reject(new ApiError_1.default('Please authenticate', http_status_1.default.UNAUTHORIZED));
    }
    req.user = user;
    if (req.headers["datatype"] && (req.headers["datatype"] === "mydocuments" || req.headers["datatype"] === "mytasks")) {
        resolve();
        return true;
    }
    if (requiredRights.length) {
        let userRights = [];
        if (user.role === 'admin') {
            userRights = roles_1.roleRights.get(user.role) || [];
        }
        else if (user.role === 'subAdmin') {
            userRights = roles_1.roleRights.get(user?.subAdminRole) || [];
        }
        else if (user.role === 'workspaceUser') {
            const workspaceUserRole = await (0, manageRole_service_1.getRoleById)(user['roleId']?.toString() || '');
            userRights = roles_1.roleRights.get(workspaceUserRole?.permissions) || [];
        }
        if (!userRights)
            return reject(new ApiError_1.default('you do not have permission to perform this action', http_status_1.default.FORBIDDEN));
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights && req.params['userId'] !== user.id) {
            return reject(new ApiError_1.default('you do not have permission to perform this action', http_status_1.default.FORBIDDEN));
        }
    }
    resolve();
};
const authMiddleware = (...requiredRights) => async (req, res, next) => new Promise((resolve, reject) => {
    console.log("Auth middleware triggered", req.headers, ".................headers");
    passport_1.default.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
})
    .then(() => next())
    .catch((err) => next(err));
exports.default = authMiddleware;

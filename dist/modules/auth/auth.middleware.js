"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const roles_1 = require("../../config/roles");
const account_services_1 = require("../account/account.services");
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    console.log('Authentication attempt:', req.headers.authorization);
    if (err || info || !user) {
        return reject(new ApiError_1.default('Please authenticate', http_status_1.default.UNAUTHORIZED));
    }
    req.user = user;
    if (req.headers['datatype'] && (req.headers['datatype'] === 'mydocuments' || req.headers['datatype'] === 'mytasks')) {
        resolve();
        return true;
    }
    if (requiredRights.length && req.headers['accountid']) {
        const findrole = await (0, account_services_1.checkUserBelongsToAccount)(user.id, req.headers['accountid'], req.params['workspaceId'] || req.body.workspace || null);
        if (!findrole)
            return reject(new ApiError_1.default('you do not have access to this account', http_status_1.default.FORBIDDEN));
        const role = findrole?.Permissions[0]?.roleId?.permissions || findrole?.Permissions[0]?.permission || null;
        console.log('Role Permissions:', role, findrole?.Permissions[0]?.roleId?.permissions, findrole?.Permissions[0]?.roleId);
        let userRights = [];
        if (role) {
            userRights = roles_1.roleRights.get(role) || [];
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
    // console.log("Auth middleware triggered", req.headers, ".................headers");
    passport_1.default.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
})
    .then(() => next())
    .catch((err) => next(err));
exports.default = authMiddleware;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const risklibrary_service_1 = require("./risklibrary.service");
const checkValidation = (0, catchAsync_1.default)(async (req, _, next) => {
    const { user } = req;
    if (user.role === 'admin') {
        await (0, risklibrary_service_1.checkAdminBelongsTtoLibrary)(req.params['libraryId'] || req.body.library, user._id);
    }
    else if (user.role === 'subadmin') {
        await (0, risklibrary_service_1.checkSubAdminBelongsToLibrary)(req.params['libraryId'] || req.body.library, user._id, req.headers["datatype"]);
    }
    else if (user.role === 'workspaceUser') {
        await (0, risklibrary_service_1.checkUserBelongsToLibrary)(req.params['libraryId'] || req.body.library, user, req.headers["datatype"]);
    }
    else {
        throw new Error('Unauthorized role for creating a role');
    }
    next();
});
exports.default = checkValidation;

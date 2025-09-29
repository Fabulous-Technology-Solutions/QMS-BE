"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const capalibrary_service_1 = require("./capalibrary.service");
const account_1 = require("../../../account");
const checkValidation = (0, catchAsync_1.default)(async (req, _, next) => {
    const { user } = req;
    if (req.headers['accountid']) {
        await account_1.accountServices.findUserBelongToCapaLibrary(user._id.toString(), req.headers['accountid'], req.params['libraryId'] || req.body.library);
    }
    else {
        await (0, capalibrary_service_1.checkAdminBelongsTtoLibrary)(req.params['libraryId'] || req.body.library, user._id);
    }
    next();
});
exports.default = checkValidation;

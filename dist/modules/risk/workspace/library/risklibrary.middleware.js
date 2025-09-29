"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const risklibrary_service_1 = require("./risklibrary.service");
const account_1 = require("../../../account");
const checkValidation = (0, catchAsync_1.default)(async (req, _, next) => {
    const { user } = req;
    if (req.headers['accountid']) {
        await account_1.accountServices.findUserBelongToRiskLibrary(user._id.toString(), req.headers['accountid'], req.params['libraryId'] || req.body.library);
    }
    else {
        await (0, risklibrary_service_1.checkAdminBelongsTtoLibrary)(req.params['libraryId'] || req.body.library, user._id);
    }
    next();
});
exports.default = checkValidation;

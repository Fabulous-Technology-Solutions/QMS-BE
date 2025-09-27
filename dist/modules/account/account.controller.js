"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchAccountController = exports.updateAccount = exports.getAccountById = exports.deleteAccount = exports.getAllAccounts = void 0;
const accountService = __importStar(require("./account.services"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// import AppiError from '../errors/ApiError';
exports.getAllAccounts = (0, catchAsync_1.default)(async (req, res) => {
    const { accountId } = req.params;
    const accounts = await accountService.getAllAccounts(accountId, Number(req.query['page']), Number(req.query['limit']), req.query['search']);
    res.status(200).json({
        status: 'success',
        data: accounts,
    });
});
exports.deleteAccount = (0, catchAsync_1.default)(async (req, res) => {
    const { accountId } = req.params;
    await accountService.deleteAccountById(accountId);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
exports.getAccountById = (0, catchAsync_1.default)(async (req, res) => {
    const { accountId } = req.params;
    const account = await accountService.getAccountById(accountId);
    res.status(200).json({
        status: 'success',
        data: account,
    });
});
exports.updateAccount = (0, catchAsync_1.default)(async (req, res) => {
    const { accountId } = req.params;
    const updateData = req.body;
    const updatedAccount = await accountService.updateAccountById(accountId, updateData);
    res.status(200).json({
        status: 'success',
        data: {
            account: updatedAccount,
        },
    });
});
exports.switchAccountController = (0, catchAsync_1.default)(async (req, res) => {
    const { accountId } = req.params;
    const account = await accountService.switchAccount(req.user._id, accountId);
    res.status(200).json({
        status: 'success',
        data: {
            account,
        },
    });
});

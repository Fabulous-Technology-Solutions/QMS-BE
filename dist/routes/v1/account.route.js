"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../modules/auth");
const account_1 = require("../../modules/account");
const validate_1 = require("../../modules/validate");
const router = (0, express_1.Router)();
router
    .route('/:accountId')
    .get((0, auth_1.auth)(), account_1.accountController.getAccountById)
    .delete((0, auth_1.auth)(), account_1.accountController.deleteAccount)
    .put((0, auth_1.auth)(), (0, validate_1.validate)(account_1.accountValidation.updateAccountValidationSchema), account_1.accountController.updateAccount);
router
    .route('/globalaccounts/:accountId')
    .get((0, auth_1.auth)(), account_1.accountController.getAllAccounts);
router
    .route('/switchaccount/:accountId')
    .get((0, auth_1.auth)(), account_1.accountController.switchAccountController);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activitylogs_controller_1 = require("../../modules/activitylogs/activitylogs.controller");
const auth_1 = require("../../modules/auth");
const router = (0, express_1.Router)();
router.get('/:id', (0, auth_1.auth)("getlogs"), activitylogs_controller_1.getLogsByIdController);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../../modules/utils");
const router = express_1.default.Router();
router.post("/", utils_1.cronController.executeScheduledReports);
exports.default = router;

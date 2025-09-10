"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../../modules/auth");
const express_1 = __importDefault(require("express"));
const attentation_controller_1 = require("../../../modules/risk/workspace/attention/attentation.controller");
const router = express_1.default.Router();
router.get("/module/:workspaceId", (0, auth_1.auth)('needAttention'), attentation_controller_1.AttentionController);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../../modules/capa/workspace/report/reporthistory/index");
const auth_1 = require("../../modules/auth");
const mangeRole_middleware_1 = __importDefault(require("../../modules/capa/workspace/mangeRole.middleware"));
const router = express_1.default.Router();
router.post('/workspace/:workspaceId/library/:libraryId', (0, auth_1.auth)('getReportPrevious'), mangeRole_middleware_1.default, index_1.reportHistoryController.createReportHistoryController);
exports.default = router;

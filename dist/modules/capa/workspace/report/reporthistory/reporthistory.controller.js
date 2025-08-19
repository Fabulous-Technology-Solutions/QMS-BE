"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportHistoryController = void 0;
const reporthistory_services_1 = require("./reporthistory.services");
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const createReportHistoryController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const reportHistory = await (0, reporthistory_services_1.createReportHistory)(libraryId);
    res.status(201).json(reportHistory);
});
exports.createReportHistoryController = createReportHistoryController;

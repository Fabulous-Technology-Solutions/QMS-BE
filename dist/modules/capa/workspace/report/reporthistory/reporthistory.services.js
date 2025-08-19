"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportHistory = void 0;
const reporthistory_modal_1 = __importDefault(require("./reporthistory.modal"));
const capalibrary_service_1 = require("../../capalibrary/capalibrary.service");
const createReportHistory = async (libraryId) => {
    const report = await (0, capalibrary_service_1.generateReport)(libraryId);
    const reportHistory = new reporthistory_modal_1.default({ library: libraryId, file: report.Location, fileKey: report.Key });
    await reportHistory.save();
    return {
        success: true,
        message: 'Preview created successfully',
        data: reportHistory
    };
};
exports.createReportHistory = createReportHistory;

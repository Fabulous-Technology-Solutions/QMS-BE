"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const report_schema_1 = __importDefault(require("../../../../shared/report/report.schema"));
const ReportModel = mongoose_1.default.model('Report', report_schema_1.default);
exports.default = ReportModel;

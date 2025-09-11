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
exports.reportController = exports.reportValidation = void 0;
const reportValidation = __importStar(require("../../../../shared/report/report.validation"));
exports.reportValidation = reportValidation;
const report_services_1 = __importDefault(require("../../../../shared/report/report.services"));
const risklibrary_service_1 = require("../library/risklibrary.service");
const report_modal_1 = __importDefault(require("./report.modal"));
const report_controller_1 = require("../../../../shared/report/report.controller");
const reportService = new report_services_1.default(report_modal_1.default, risklibrary_service_1.generateFilterReport);
const reportController = new report_controller_1.ReportController(reportService, 'RiskReport');
exports.reportController = reportController;

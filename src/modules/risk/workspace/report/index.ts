import * as reportValidation from "../../../../shared/report/report.validation";
import  ReportService  from "../../../../shared/report/report.services";
import { generateFilterReport } from '../library/risklibrary.service';
import ReportModel from "./report.modal";
import { ReportController } from "../../../../shared/report/report.controller";
const reportService = new ReportService(ReportModel,generateFilterReport);
const reportController = new ReportController(reportService, 'RiskReport');
export { reportValidation, reportController };
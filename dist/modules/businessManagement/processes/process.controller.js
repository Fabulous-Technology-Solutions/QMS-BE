"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessesBySite = exports.getProcessNamesByModule = exports.getProcessesByModule = exports.getAllProcesses = exports.getProcess = exports.deleteProcess = exports.updateProcess = exports.createProcess = void 0;
const process_services_1 = __importDefault(require("./process.services"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createProcess = (0, catchAsync_1.default)(async (req, res) => {
    const process = await process_services_1.default.createProcessService({
        ...req.body,
        createdBy: req.user.id
    });
    res.status(201).json(process);
});
exports.createProcess = createProcess;
const updateProcess = (0, catchAsync_1.default)(async (req, res) => {
    const process = await process_services_1.default.updateProcessService(req.params["id"], req.body, req.user);
    res.status(200).json(process);
});
exports.updateProcess = updateProcess;
const deleteProcess = (0, catchAsync_1.default)(async (req, res) => {
    await process_services_1.default.deleteProcessService(req.params["id"], req.user);
    res.status(204).send();
});
exports.deleteProcess = deleteProcess;
const getProcess = (0, catchAsync_1.default)(async (req, res) => {
    const process = await process_services_1.default.getProcessService(req.params["id"]);
    res.status(200).json(process);
});
exports.getProcess = getProcess;
const getAllProcesses = (0, catchAsync_1.default)(async (req, res) => {
    const processes = await process_services_1.default.getAllProcessesService(req.query, req.user);
    res.status(200).json(processes);
});
exports.getAllProcesses = getAllProcesses;
const getProcessesByModule = (0, catchAsync_1.default)(async (req, res) => {
    const processes = await process_services_1.default.getProcessByModuleIdService(req.params["moduleId"], req.query);
    res.status(200).json(processes);
});
exports.getProcessesByModule = getProcessesByModule;
const getProcessNamesByModule = (0, catchAsync_1.default)(async (req, res) => {
    const processNames = await process_services_1.default.getProcessNamesByModuleService(req.params["moduleId"]);
    res.status(200).json(processNames);
});
exports.getProcessNamesByModule = getProcessNamesByModule;
const getProcessesBySite = (0, catchAsync_1.default)(async (req, res) => {
    const processes = await process_services_1.default.getProcessesBySiteService(req.params["siteId"], req.query);
    res.status(200).json(processes);
});
exports.getProcessesBySite = getProcessesBySite;

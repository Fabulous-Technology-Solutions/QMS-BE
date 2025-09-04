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
exports.deleteControl = exports.updateControl = exports.getControlById = exports.getAllControls = exports.createControl = void 0;
const controlService = __importStar(require("./control.services"));
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const createControl = (0, catchAsync_1.default)(async (req, res) => {
    const control = await controlService.createActionService({ ...req.body, createdBy: req.user?._id });
    res.locals['documentId'] = control._id;
    res.locals['collectionName'] = 'Control';
    res.locals['action'] = 'create';
    res.locals['message'] = 'create control';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = control;
    res.status(201).json({ success: true, data: control });
});
exports.createControl = createControl;
const getAllControls = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const page = parseInt(req.query['page']) || 1;
    const limit = parseInt(req.query['limit']) || 10;
    const search = req.query['search'];
    const controls = await controlService.getAllControlService(libraryId, page, limit, search);
    res.status(200).json({ success: true, data: controls });
});
exports.getAllControls = getAllControls;
const getControlById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const control = await controlService.getControlByIdService(id);
    res.status(200).json({ success: true, data: control });
});
exports.getControlById = getControlById;
const updateControl = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const control = await controlService.updateControlService(id, req.body);
    res.locals['documentId'] = control._id;
    res.locals['collectionName'] = 'Control';
    res.locals['action'] = 'update';
    res.locals['message'] = 'update control';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = control;
    res.status(200).json({ success: true, data: control });
});
exports.updateControl = updateControl;
const deleteControl = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const control = await controlService.deleteControlService(id);
    res.locals['documentId'] = control._id;
    res.locals['collectionName'] = 'Control';
    res.locals['action'] = 'delete';
    res.locals['message'] = 'delete control';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = { isDeleted: true };
    res.status(200).json({ success: true, data: control });
});
exports.deleteControl = deleteControl;

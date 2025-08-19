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
exports.deleteChecklistHistoryController = exports.updateChecklistHistoryController = exports.getChecklistHistoriesByLibraryController = exports.getChecklistHistoryByIdController = exports.createChecklistHistoryController = void 0;
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const historyService = __importStar(require("./checklisthistory.services"));
// Create a new checklist history entry
exports.createChecklistHistoryController = (0, catchAsync_1.default)(async (req, res) => {
    const createdBy = req.user._id;
    const data = { ...req.body, createdBy };
    const history = await historyService.createChecklistHistory(data);
    res.status(201).json({ success: true, data: history });
});
// Get a single checklist history by its ID
exports.getChecklistHistoryByIdController = (0, catchAsync_1.default)(async (req, res) => {
    const { historyId } = req.params;
    const history = await historyService.getChecklistHistoryById(historyId);
    res.status(200).json({ success: true, data: history });
});
// List histories by library with pagination
exports.getChecklistHistoriesByLibraryController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const page = Number(req.query["page"]) || 1;
    const limit = Number(req.query["limit"]) || 10;
    const result = await historyService.getChecklistHistoriesByLibrary(libraryId, page, limit);
    res.status(200).json({ success: true, ...result });
});
// Update an existing checklist history entry
exports.updateChecklistHistoryController = (0, catchAsync_1.default)(async (req, res) => {
    const { historyId } = req.params;
    const updated = await historyService.updateChecklistHistory(historyId, req.body);
    res.status(200).json({ success: true, data: updated });
});
// Delete a checklist history entry
exports.deleteChecklistHistoryController = (0, catchAsync_1.default)(async (req, res) => {
    const { historyId } = req.params;
    await historyService.deleteChecklistHistory(historyId);
    res.status(204).send();
});

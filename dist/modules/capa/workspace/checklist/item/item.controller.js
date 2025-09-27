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
exports.getChecklistItemsByChecklistId = exports.deleteChecklistItem = exports.updateChecklistItem = exports.createChecklistItem = void 0;
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const checklistService = __importStar(require("./item.services"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const item_validation_1 = require("./item.validation");
const JoiError_1 = __importDefault(require("../../../../errors/JoiError"));
exports.createChecklistItem = (0, catchAsync_1.default)(async (req, res) => {
    const checklistItemsArray = req.body.checklistItems;
    const { error } = item_validation_1.CreateItemsArraySchema.body.validate(checklistItemsArray);
    if (error) {
        const errorFields = (0, JoiError_1.default)(error);
        throw new ApiError_1.default('Invalid request', 400, errorFields);
    }
    const checklistId = req.params['checklistId'];
    const createdBy = req.user._id;
    const createdItems = await Promise.all(checklistItemsArray.map((item) => checklistService.createCheckListItem({
        ...item,
        createdBy,
        checklistId,
    })));
    res.status(201).json({
        success: true,
        message: 'Checklist items created successfully',
        data: createdItems,
    });
});
exports.updateChecklistItem = (0, catchAsync_1.default)(async (req, res) => {
    const updateItemsArray = req.body.checklistItems;
    const { error } = item_validation_1.UpdateItemsArraySchema.body.validate(updateItemsArray, { abortEarly: false, allowUnknown: true });
    if (error) {
        const errorFields = (0, JoiError_1.default)(error);
        throw new ApiError_1.default('Invalid request', 400, errorFields);
    }
    const updatedItems = await Promise.all(updateItemsArray.map((item) => checklistService.updateCheckListItem(item._id, item.data)));
    res.status(200).json({
        success: true,
        message: 'Checklist items updated successfully',
        data: updatedItems,
    });
});
exports.deleteChecklistItem = (0, catchAsync_1.default)(async (req, res) => {
    const checklistItem = await checklistService.deleteCheckListItem(req.params['itemId']);
    res.status(200).json({
        success: true,
        message: 'Checklist item deleted successfully',
        data: checklistItem,
    });
});
exports.getChecklistItemsByChecklistId = (0, catchAsync_1.default)(async (req, res) => {
    const checklistItems = await checklistService.getCheckListItemsByChecklistId(req.params['checklistId']);
    res.status(200).json({
        success: true,
        message: 'Checklist items retrieved successfully',
        data: checklistItems,
    });
});

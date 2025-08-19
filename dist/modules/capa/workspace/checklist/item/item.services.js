"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckListItemsByChecklistId = exports.deleteCheckListItem = exports.updateCheckListItem = exports.getCheckListItemById = exports.createCheckListItem = void 0;
const item_modal_1 = __importDefault(require("./item.modal"));
const createCheckListItem = async (data) => {
    const checkListItem = new item_modal_1.default(data);
    await checkListItem.save();
    return checkListItem;
};
exports.createCheckListItem = createCheckListItem;
const getCheckListItemById = async (itemId) => {
    const checkListItem = await item_modal_1.default.findOne({ _id: itemId, isDelete: false })
        .populate('checklist', 'name description');
    if (!checkListItem) {
        throw new Error('Checklist item not found');
    }
    return checkListItem;
};
exports.getCheckListItemById = getCheckListItemById;
const updateCheckListItem = async (itemId, data) => {
    const checkListItem = await item_modal_1.default.findOneAndUpdate({ _id: itemId, isDelete: false }, data, { new: false });
    if (!checkListItem) {
        throw new Error('Checklist item not found');
    }
    return checkListItem;
};
exports.updateCheckListItem = updateCheckListItem;
const deleteCheckListItem = async (itemId) => {
    const checkListItem = await item_modal_1.default.findOneAndUpdate({ _id: itemId, isDelete: false }, { isDelete: true }, { new: true });
    if (!checkListItem) {
        throw new Error('Checklist item not found');
    }
    return checkListItem;
};
exports.deleteCheckListItem = deleteCheckListItem;
const getCheckListItemsByChecklistId = async (checklistId) => {
    const checkListItems = await item_modal_1.default.find({ checklist: checklistId, isDeleted: false })
        .populate('checklist', 'name description');
    return checkListItems;
};
exports.getCheckListItemsByChecklistId = getCheckListItemsByChecklistId;

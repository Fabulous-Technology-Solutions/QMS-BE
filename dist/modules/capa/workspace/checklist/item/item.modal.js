"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const checkListItemSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    checklist: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Checklist', required: true },
    isDeleted: { type: Boolean, default: false }
});
const CheckListItem = mongoose_1.default.model('CheckListItem', checkListItemSchema);
exports.default = CheckListItem;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const actionSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Account', required: true }],
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Library', required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    type: { type: String, enum: ['preventive', 'corrective'], default: 'preventive' },
    endDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'on-hold'], default: 'pending' },
    docfile: { type: String, required: false },
    docfileKey: { type: String, required: false },
    cause: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Causes' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const Action = mongoose_1.default.model('Action', actionSchema);
exports.default = Action;

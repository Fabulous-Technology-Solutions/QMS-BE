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
    assignedTo: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }],
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true },
    endDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
    budget: { type: Number },
    personnel: { type: String },
    docfile: { type: String, required: false },
    docfileKey: { type: String, required: false },
    cause: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RiskCauses' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const Action = mongoose_1.default.model('RiskAction', actionSchema);
exports.default = Action;

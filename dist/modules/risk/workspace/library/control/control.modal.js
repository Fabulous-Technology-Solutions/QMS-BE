"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const controlSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Library', required: true },
    description: { type: String, required: true },
    controlType: { type: String, required: true },
    effectiveness: { type: String, required: true },
    owners: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }],
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const ControlModel = mongoose_1.default.model('Control', controlSchema);
exports.default = ControlModel;

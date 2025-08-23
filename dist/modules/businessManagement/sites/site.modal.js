"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SiteSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    timeZone: { type: String, required: true },
    siteCode: { type: String, required: true },
    note: { type: String, required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    modules: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Subscription' }],
    status: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
const SiteModel = mongoose_1.default.model('Site', SiteSchema);
exports.default = SiteModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attachment_schema_1 = __importDefault(require("../../../../../shared/attachment/attachment.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
attachment_schema_1.default.add({
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true }
});
const AttachmentModal = mongoose_1.default.model('RiskAttachment', attachment_schema_1.default);
exports.default = AttachmentModal;

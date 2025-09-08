"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ishikawa_schema_1 = __importDefault(require("../../../../../shared/ishikawa/ishikawa.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
ishikawa_schema_1.default.add({
    library: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true }
});
const IshikawaModel = mongoose_1.default.model('RiskIshikawa', ishikawa_schema_1.default);
exports.default = IshikawaModel;

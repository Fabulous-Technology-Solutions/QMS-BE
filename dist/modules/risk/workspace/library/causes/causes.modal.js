"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cause_schema_1 = __importDefault(require("../../../../../shared/cause/cause.schema"));
const Causes = mongoose_1.default.model('RiskCauses', cause_schema_1.default);
exports.default = Causes;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fivewhys_modal_1 = __importDefault(require("../../../../../shared/fivewhys/fivewhys.modal"));
const FiveWhysModel = mongoose_1.default.model("FiveWhys", fivewhys_modal_1.default);
exports.default = FiveWhysModel;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiveWhyValidation = exports.FiveWhysService = exports.FiveWhysController = void 0;
const fivewhys_service_1 = require("../../../../../shared/fivewhys/fivewhys.service");
const FiveWhyValidation = __importStar(require("../../../../../shared/fivewhys/fivewhys.validation"));
exports.FiveWhyValidation = FiveWhyValidation;
const fivewhys_controller_1 = require("../../../../../shared/fivewhys/fivewhys.controller");
const fivewhys_modal_1 = __importDefault(require("./fivewhys.modal"));
const FiveWhysService = new fivewhys_service_1.FiveWhysServices(fivewhys_modal_1.default);
exports.FiveWhysService = FiveWhysService;
const FiveWhysController = new fivewhys_controller_1.fiveWhysController(FiveWhysService, 'RiskFiveWhys');
exports.FiveWhysController = FiveWhysController;

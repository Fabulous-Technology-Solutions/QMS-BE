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
exports.ishikawaService = exports.IshikawaValidation = exports.IshikawaController = void 0;
const IshikawaValidation = __importStar(require("../../../../../shared/ishikawa/ishikawa.validation"));
exports.IshikawaValidation = IshikawaValidation;
const ishikawa_services_1 = require("../../../../../shared/ishikawa/ishikawa.services");
const Ishikawa_modal_1 = __importDefault(require("./Ishikawa.modal"));
const ishikawa_controller_1 = require("../../../../../shared/ishikawa/ishikawa.controller");
const ishikawaService = new ishikawa_services_1.IshikawaServices(Ishikawa_modal_1.default);
exports.ishikawaService = ishikawaService;
const IshikawaController = new ishikawa_controller_1.IsikawaController(ishikawaService, 'Ishikawa');
exports.IshikawaController = IshikawaController;

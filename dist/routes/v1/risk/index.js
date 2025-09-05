"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskConsequenceRoute = exports.riskControlRoute = exports.riskLibraryRoute = void 0;
const library_route_1 = __importDefault(require("./library.route"));
exports.riskLibraryRoute = library_route_1.default;
const control_route_1 = __importDefault(require("./control.route"));
exports.riskControlRoute = control_route_1.default;
const consequence_route_1 = __importDefault(require("./consequence.route"));
exports.riskConsequenceRoute = consequence_route_1.default;

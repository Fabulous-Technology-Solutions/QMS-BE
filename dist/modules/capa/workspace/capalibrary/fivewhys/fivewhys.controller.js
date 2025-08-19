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
exports.getFiveWhysByLibrary = exports.deleteFiveWhys = exports.updateFiveWhys = exports.getFiveWhys = exports.createFiveWhys = void 0;
const FiveWhyService = __importStar(require("./fivewhys.service"));
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
exports.createFiveWhys = (0, catchAsync_1.default)(async (req, res) => {
    const fiveWhys = await FiveWhyService.createFiveWhys({ ...req.body, createdBy: req.user._id });
    res.locals["message"] = "Five Whys created";
    res.locals["documentId"] = fiveWhys._id;
    res.locals["collectionName"] = "FiveWhys";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = fiveWhys;
    res.status(201).json(fiveWhys);
});
exports.getFiveWhys = (0, catchAsync_1.default)(async (req, res) => {
    const fiveWhys = await FiveWhyService.getFiveWhys(req.params["fivewhysid"] || "");
    res.status(200).json(fiveWhys);
});
exports.updateFiveWhys = (0, catchAsync_1.default)(async (req, res) => {
    const fiveWhys = await FiveWhyService.updateFiveWhys(req.params["fivewhysid"] || "", req.body);
    res.locals["message"] = "Five Whys updated";
    res.locals["documentId"] = fiveWhys?._id;
    res.locals["collectionName"] = "FiveWhys";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = fiveWhys;
    res.status(200).json(fiveWhys);
});
exports.deleteFiveWhys = (0, catchAsync_1.default)(async (req, res) => {
    await FiveWhyService.deleteFiveWhys(req.params["fivewhysid"] || "");
    res.locals["message"] = "Five Whys deleted";
    res.locals["documentId"] = req.params["fivewhysid"];
    res.locals["collectionName"] = "FiveWhys";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.status(204).send();
});
exports.getFiveWhysByLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const fiveWhys = await FiveWhyService.getFiveWhysByLibrary(req.params["libraryId"] || "", Number(req.query["page"]), Number(req.query["limit"]), req.query["search"]);
    res.status(200).json(fiveWhys);
});

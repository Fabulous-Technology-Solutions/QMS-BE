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
exports.getCausesNamesByLibrary = exports.getCausesByLibrary = exports.getCauseById = exports.deleteCause = exports.updateCause = exports.createCause = void 0;
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const causeService = __importStar(require("./causes.service"));
exports.createCause = (0, catchAsync_1.default)(async (req, res) => {
    const cause = await causeService.createCauses(req.body);
    res.locals["message"] = "create cause";
    res.locals["documentId"] = cause._id;
    res.locals["collectionName"] = "Cause";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = cause;
    res.status(201).json(cause);
});
exports.updateCause = (0, catchAsync_1.default)(async (req, res) => {
    const { causeId } = req.params;
    const updatedCause = await causeService.updateCauses(causeId || "", req.body);
    res.locals["message"] = "update cause";
    res.locals["documentId"] = updatedCause._id;
    res.locals["collectionName"] = "Cause";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals["changes"] = updatedCause;
    res.status(200).json(updatedCause);
});
exports.deleteCause = (0, catchAsync_1.default)(async (req, res) => {
    const { causeId } = req.params;
    const deletedCause = await causeService.deleteCauses(causeId);
    res.locals["message"] = "delete cause";
    res.locals["documentId"] = deletedCause._id;
    res.locals["collectionName"] = "Cause";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.status(200).json(deletedCause);
});
exports.getCauseById = (0, catchAsync_1.default)(async (req, res) => {
    const { causeId } = req.params;
    const cause = await causeService.getCausesById(causeId);
    res.status(200).json(cause);
});
exports.getCausesByLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;
    const causes = await causeService.getCausesByLibrary(libraryId || "", Number(page || 1), Number(limit || 10), search);
    res.status(200).json(causes);
});
exports.getCausesNamesByLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const causes = await causeService.getNamesByLibrary(libraryId);
    res.status(200).json(causes);
});

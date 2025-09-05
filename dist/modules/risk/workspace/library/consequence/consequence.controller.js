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
exports.deleteConsequence = exports.updateConsequence = exports.getConsequence = exports.getConsequences = exports.createConsequence = void 0;
const ConsequenceService = __importStar(require("./consequence.services"));
const catchAsync_1 = __importDefault(require("../../../../utils/catchAsync"));
const createConsequence = (0, catchAsync_1.default)(async (req, res) => {
    const consequence = await ConsequenceService.createConsequence({
        ...req.body,
        createdBy: req.user?._id
    });
    res.locals['documentId'] = consequence._id;
    res.locals['collectionName'] = 'Consequence';
    res.locals['action'] = 'create';
    res.locals['message'] = 'create consequence';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = consequence;
    res.status(201).json({ data: consequence });
});
exports.createConsequence = createConsequence;
const getConsequences = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { page, limit, search } = req.query;
    const consequences = await ConsequenceService.getConsequencesByLibrary(libraryId, Number(page), Number(limit), search);
    res.status(200).json({ ...consequences, success: true });
});
exports.getConsequences = getConsequences;
const getConsequence = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const consequence = await ConsequenceService.getConsequenceById(id);
    res.status(200).json({ data: consequence });
});
exports.getConsequence = getConsequence;
const updateConsequence = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const consequence = await ConsequenceService.updateConsequence(id, req.body);
    res.locals['documentId'] = consequence._id;
    res.locals['collectionName'] = 'Consequence';
    res.locals['action'] = 'update';
    res.locals['message'] = 'update consequence';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = consequence;
    res.status(200).json({ data: consequence });
});
exports.updateConsequence = updateConsequence;
const deleteConsequence = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await ConsequenceService.deleteConsequence(id);
    res.locals['documentId'] = id;
    res.locals['collectionName'] = 'Consequence';
    res.locals['action'] = 'delete';
    res.locals['message'] = 'delete consequence';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = { isDeleted: true };
    res.status(204).send({
        data: null,
        message: 'Consequence deleted successfully',
        success: true
    });
});
exports.deleteConsequence = deleteConsequence;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIshikawa = exports.getIshikawaByLibraryId = exports.getIshikawaById = exports.createIshikawa = void 0;
const IshikawaService = __importStar(require("./Ishikawa.services"));
const utils_1 = require("../../../../utils");
const createIshikawa = (0, utils_1.catchAsync)(async (req, res) => {
    const newIshikawa = await IshikawaService.createIshikawa({ ...req.body, createdBy: req.user.id });
    res.locals["message"] = "create Ishikawa";
    res.locals["documentId"] = newIshikawa._id || "";
    res.locals["collectionName"] = "Ishikawa";
    res.locals["action"] = "create";
    res.locals["changes"] = newIshikawa;
    res.locals['logof'] = req.body.library || null;
    res.status(201).json(newIshikawa);
});
exports.createIshikawa = createIshikawa;
const getIshikawaById = (0, utils_1.catchAsync)(async (req, res) => {
    const ishikawa = await IshikawaService.getIshikawaById(req.params['id']);
    res.status(200).json(ishikawa);
});
exports.getIshikawaById = getIshikawaById;
const getIshikawaByLibraryId = (0, utils_1.catchAsync)(async (req, res) => {
    const { libraryId } = req.params;
    const { page, limit, search } = req.query;
    const ishikawaList = await IshikawaService.getIshikawaByLibraryId(libraryId, Number(page), Number(limit), search);
    res.status(200).json(ishikawaList);
});
exports.getIshikawaByLibraryId = getIshikawaByLibraryId;
const deleteIshikawa = (0, utils_1.catchAsync)(async (req, res) => {
    await IshikawaService.deleteIshikawa(req.params['id']);
    res.locals["message"] = "delete Ishikawa";
    res.locals["documentId"] = req.params['id'];
    res.locals["collectionName"] = "Ishikawa";
    res.locals["action"] = "delete";
    res.locals["changes"] = null;
    res.locals['logof'] = req.params['libraryId'];
    res.status(204).send({
        message: "delete Ishikawa successfully"
    });
});
exports.deleteIshikawa = deleteIshikawa;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsikawaController = void 0;
const catchAsync_1 = __importDefault(require("../../modules/utils/catchAsync"));
class IsikawaController {
    constructor(service, collectionName) {
        this.create = (0, catchAsync_1.default)(async (req, res) => {
            // @ts-ignore (service typing depends on BaseService)
            const doc = await this.service.create({ ...req.body, createdBy: req.user._id });
            res.locals["message"] = `create ${this.collectionName.toLowerCase()}`;
            res.locals["documentId"] = doc._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
            res.locals["changes"] = doc;
            res.status(201).json(doc);
        });
        this.update = (0, catchAsync_1.default)(async (req, res) => {
            const { id } = req.params;
            // @ts-ignore
            const doc = await this.service.update(id, req.body);
            res.locals["message"] = `update ${this.collectionName.toLowerCase()}`;
            res.locals["documentId"] = doc._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
            res.locals["changes"] = doc;
            res.status(200).json(doc);
        });
        this.delete = (0, catchAsync_1.default)(async (req, res) => {
            const { id } = req.params;
            // @ts-ignore
            const doc = await this.service.delete(id);
            res.locals["message"] = `delete ${this.collectionName.toLowerCase()}`;
            res.locals["documentId"] = doc._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
            res.locals["changes"] = { isDeleted: true };
            res.status(200).json(doc);
        });
        this.getById = (0, catchAsync_1.default)(async (req, res) => {
            const { id } = req.params;
            // @ts-ignore
            const doc = await this.service.getById(id);
            res.status(200).json(doc);
        });
        this.getByLibrary = (0, catchAsync_1.default)(async (req, res) => {
            const { libraryId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            // @ts-ignore
            const docs = await this.service.getByLibrary(libraryId, Number(page), Number(limit));
            res.status(200).json(docs);
        });
        this.service = service;
        this.collectionName = collectionName;
    }
}
exports.IsikawaController = IsikawaController;

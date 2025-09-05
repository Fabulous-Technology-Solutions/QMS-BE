"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const catchAsync_1 = __importDefault(require("../../modules/utils/catchAsync"));
class BaseController {
    constructor(service, collectionName) {
        this.create = (0, catchAsync_1.default)(async (req, res) => {
            // @ts-ignore (service typing depends on BaseService)
            const doc = await this.service.create(req.body);
            res.locals["message"] = `create ${this.collectionName.toLowerCase()}`;
            res.locals["documentId"] = doc._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
            res.locals["changes"] = doc;
            res.status(201).json(doc);
        });
        this.update = (0, catchAsync_1.default)(async (req, res) => {
            const { causeId } = req.params;
            // @ts-ignore
            const doc = await this.service.update(causeId, req.body);
            res.locals["message"] = `update ${this.collectionName.toLowerCase()}`;
            res.locals["documentId"] = doc._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
            res.locals["changes"] = doc;
            res.status(200).json(doc);
        });
        this.delete = (0, catchAsync_1.default)(async (req, res) => {
            const { causeId } = req.params;
            // @ts-ignore
            const doc = await this.service.delete(causeId);
            res.locals["message"] = `delete ${this.collectionName.toLowerCase()}`;
            res.locals["documentId"] = doc._id;
            res.locals["collectionName"] = this.collectionName;
            res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
            res.locals["changes"] = { isDeleted: true };
            res.status(200).json(doc);
        });
        this.getById = (0, catchAsync_1.default)(async (req, res) => {
            const { causeId } = req.params;
            // @ts-ignore
            const doc = await this.service.getById(causeId);
            res.status(200).json(doc);
        });
        this.getByLibrary = (0, catchAsync_1.default)(async (req, res) => {
            const { libraryId } = req.params;
            const { page = 1, limit = 10, search = "" } = req.query;
            // @ts-ignore
            const docs = await this.service.getByLibrary(libraryId, Number(page), Number(limit), search);
            res.status(200).json(docs);
        });
        this.getNamesByLibrary = (0, catchAsync_1.default)(async (req, res) => {
            const { libraryId } = req.params;
            // @ts-ignore
            const docs = await this.service.getNamesByLibrary(libraryId);
            res.status(200).json(docs);
        });
        this.service = service;
        this.collectionName = collectionName;
    }
}
exports.BaseController = BaseController;

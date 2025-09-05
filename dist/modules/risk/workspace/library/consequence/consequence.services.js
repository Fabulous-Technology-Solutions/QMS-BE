"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConsequence = exports.updateConsequence = exports.getConsequenceById = exports.getConsequencesByLibrary = exports.createConsequence = void 0;
const consequence_modal_1 = __importDefault(require("./consequence.modal"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const createConsequence = async (input) => {
    const consequence = new consequence_modal_1.default(input);
    return await consequence.save();
};
exports.createConsequence = createConsequence;
const getConsequencesByLibrary = async (libraryId, page = 1, limit = 10, search) => {
    const skip = (page - 1) * limit;
    const query = { library: libraryId };
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    const [consequences, total] = await Promise.all([
        consequence_modal_1.default.find(query).skip(skip).limit(limit),
        consequence_modal_1.default.countDocuments(query)
    ]);
    return {
        consequences,
        total,
        page,
        limit
    };
};
exports.getConsequencesByLibrary = getConsequencesByLibrary;
const getConsequenceById = async (id) => {
    const consequence = await consequence_modal_1.default.findById(id);
    if (!consequence) {
        throw new ApiError_1.default("Consequence not found", 404);
    }
    return consequence;
};
exports.getConsequenceById = getConsequenceById;
const updateConsequence = async (id, updateData) => {
    const consequence = await consequence_modal_1.default.findByIdAndUpdate(id, updateData, { new: true });
    if (!consequence) {
        throw new ApiError_1.default("Consequence not found", 404);
    }
    return consequence;
};
exports.updateConsequence = updateConsequence;
const deleteConsequence = async (id) => {
    const consequence = await consequence_modal_1.default.findByIdAndDelete(id);
    if (!consequence) {
        throw new ApiError_1.default("Consequence not found", 404);
    }
    return consequence;
};
exports.deleteConsequence = deleteConsequence;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamesByLibrary = exports.getCausesByLibrary = exports.getCausesById = exports.deleteCauses = exports.updateCauses = exports.createCauses = void 0;
const causes_modal_1 = __importDefault(require("./causes.modal"));
const createCauses = async (data) => {
    const causes = new causes_modal_1.default({
        name: data.name,
        description: data.description,
        library: data.library,
    });
    return await causes.save();
};
exports.createCauses = createCauses;
const updateCauses = async (causesId, updateData) => {
    const causes = await causes_modal_1.default.findOneAndUpdate({ _id: causesId, isDeleted: false }, updateData, { new: true });
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};
exports.updateCauses = updateCauses;
const deleteCauses = async (causesId) => {
    const causes = await causes_modal_1.default.findOneAndUpdate({ _id: causesId, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};
exports.deleteCauses = deleteCauses;
const getCausesById = async (causesId) => {
    const causes = await causes_modal_1.default.findOne({ _id: causesId, isDeleted: false });
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};
exports.getCausesById = getCausesById;
const getCausesByLibrary = async (libraryId, page, limit, search) => {
    const query = { library: libraryId, isDeleted: false };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const causes = await causes_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await causes_modal_1.default.countDocuments(query);
    return {
        data: causes,
        total,
        page,
        limit,
        success: true,
        message: 'Causes retrieved successfully',
    };
};
exports.getCausesByLibrary = getCausesByLibrary;
const getNamesByLibrary = async (libraryId) => {
    const causes = await causes_modal_1.default.find({ library: libraryId, isDeleted: false }, 'name');
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};
exports.getNamesByLibrary = getNamesByLibrary;

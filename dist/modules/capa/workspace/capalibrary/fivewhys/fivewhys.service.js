"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiveWhysByLibrary = exports.deleteFiveWhys = exports.updateFiveWhys = exports.getFiveWhys = exports.createFiveWhys = void 0;
const fivewhys_modal_1 = __importDefault(require("./fivewhys.modal"));
const createFiveWhys = async (data) => {
    const fiveWhys = new fivewhys_modal_1.default(data);
    return await fiveWhys.save();
};
exports.createFiveWhys = createFiveWhys;
const getFiveWhys = async (id) => {
    return await fivewhys_modal_1.default.findById(id).populate('createdBy');
};
exports.getFiveWhys = getFiveWhys;
const updateFiveWhys = async (id, data) => {
    return await fivewhys_modal_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateFiveWhys = updateFiveWhys;
const deleteFiveWhys = async (id) => {
    return await fivewhys_modal_1.default.findByIdAndDelete(id);
};
exports.deleteFiveWhys = deleteFiveWhys;
const getFiveWhysByLibrary = async (libraryId, page = 1, limit = 10, search) => {
    const skip = (page - 1) * limit;
    const matchQuery = { library: libraryId };
    if (search) {
        matchQuery.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    const fiveWhys = await fivewhys_modal_1.default.aggregate([
        { $match: matchQuery },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
            },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
    ]);
    const total = await fivewhys_modal_1.default.countDocuments(matchQuery);
    return { total, data: fiveWhys, page, limit, success: true };
};
exports.getFiveWhysByLibrary = getFiveWhysByLibrary;

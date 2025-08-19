"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIshikawa = exports.getIshikawaByLibraryId = exports.getIshikawaById = exports.createIshikawa = void 0;
const Ishikawa_modal_1 = __importDefault(require("./Ishikawa.modal"));
const mongoose_1 = __importDefault(require("mongoose"));
const createIshikawa = async (data) => {
    const newIshikawa = new Ishikawa_modal_1.default(data);
    return await newIshikawa.save();
};
exports.createIshikawa = createIshikawa;
const getIshikawaById = async (id) => {
    return await Ishikawa_modal_1.default.findById(id);
};
exports.getIshikawaById = getIshikawaById;
const getIshikawaByLibraryId = async (libraryId, page = 1, limit = 10, search) => {
    const skip = (page - 1) * limit;
    const matchStage = { library: new mongoose_1.default.Types.ObjectId(libraryId) };
    if (search) {
        matchStage.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    const pipeline = [
        { $match: matchStage },
        {
            $facet: {
                data: [{
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy"
                        }
                    },
                    {
                        $unwind: {
                            path: "$createdBy",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        }
    ];
    const [result] = await Ishikawa_modal_1.default.aggregate(pipeline);
    return {
        data: result.data,
        total: result.totalCount[0]?.count || 0,
        page,
        limit
    };
};
exports.getIshikawaByLibraryId = getIshikawaByLibraryId;
const deleteIshikawa = async (id) => {
    return await Ishikawa_modal_1.default.findByIdAndDelete(id);
};
exports.deleteIshikawa = deleteIshikawa;

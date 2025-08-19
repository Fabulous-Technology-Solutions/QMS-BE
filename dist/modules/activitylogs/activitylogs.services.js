"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getlogsByid = void 0;
const activitylogs_modal_1 = __importDefault(require("./activitylogs.modal"));
const getlogsByid = async (id, options = {}) => {
    if (!id) {
        throw new Error("documentId and collectionName are required");
    }
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const logs = await activitylogs_modal_1.default.find({ logof: id })
        .populate('performedBy', 'name email profilePicture role').select('-__v -changes')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await activitylogs_modal_1.default.countDocuments({ logof: id });
    return {
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getlogsByid = getlogsByid;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteControlService = exports.updateControlService = exports.getControlByIdService = exports.getAllControlService = exports.createActionService = void 0;
const control_modal_1 = __importDefault(require("./control.modal"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const createActionService = async (data) => {
    const control = new control_modal_1.default(data);
    return control.save();
};
exports.createActionService = createActionService;
const getAllControlService = async (libraryId, page = 1, limit = 10, search) => {
    const skip = (page - 1) * limit;
    const query = { library: libraryId };
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    const controls = await control_modal_1.default.find(query).populate('owners', 'name profilePicture')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await control_modal_1.default.countDocuments(query);
    return {
        controls,
        total,
        page,
        limit
    };
};
exports.getAllControlService = getAllControlService;
const getControlByIdService = async (id) => {
    const control = await control_modal_1.default.findById(id).populate('owners', 'name profilePicture');
    if (!control) {
        throw new ApiError_1.default('Control not found', 404);
    }
    return control;
};
exports.getControlByIdService = getControlByIdService;
const updateControlService = async (id, data) => {
    const control = await control_modal_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!control) {
        throw new ApiError_1.default('Control not found', 404);
    }
    return control;
};
exports.updateControlService = updateControlService;
const deleteControlService = async (id) => {
    const control = await control_modal_1.default.findByIdAndDelete(id);
    if (!control) {
        throw new ApiError_1.default('Control not found', 404);
    }
    return control;
};
exports.deleteControlService = deleteControlService;

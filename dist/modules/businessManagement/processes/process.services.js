"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_modal_1 = __importDefault(require("./process.modal"));
const createProcessService = async (processData) => {
    const newProcess = new process_modal_1.default(processData);
    return await newProcess.save();
};
const updateProcessService = async (id, processData, user) => {
    const query = { _id: id };
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy;
    }
    else {
        throw new Error('Unauthorized');
    }
    return await process_modal_1.default.findOneAndUpdate(query, processData, { new: true });
};
const deleteProcessService = async (id, user) => {
    const query = { _id: id };
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy;
    }
    else {
        throw new Error('Unauthorized');
    }
    return await process_modal_1.default.findOneAndDelete(query);
};
const getProcessService = async (id) => {
    return await process_modal_1.default.findById(id);
};
const getAllProcessesService = async (options, user) => {
    const { page = 1, limit = 10, search = '' } = options || {};
    const query = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy;
    }
    else {
        throw new Error('Unauthorized');
    }
    const processes = await process_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('parentSite', 'name')
        .populate({
        path: 'modules',
        populate: {
            path: 'planId',
            select: 'name price',
        },
        select: '_id',
    });
    const total = await process_modal_1.default.countDocuments(query);
    return {
        data: processes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
const getProcessByModuleIdService = async (moduleId, options) => {
    const { page = 1, limit = 10, search = '' } = options || {};
    const query = { modules: { $in: [moduleId] } };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const processes = await process_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('parentSite', 'name')
        .populate('modules', 'name');
    const total = await process_modal_1.default.countDocuments(query);
    return {
        data: processes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
const getProcessNamesByModuleService = async (moduleId) => {
    return await process_modal_1.default.find({ modules: { $in: [moduleId] } }).select('name');
};
const getProcessesBySiteService = async (siteId, options) => {
    const { page = 1, limit = 10, search = '' } = options || {};
    const query = { parentSite: siteId };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const processes = await process_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('parentSite', 'name')
        .populate('modules', 'name');
    const total = await process_modal_1.default.countDocuments(query);
    return {
        data: processes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
exports.default = {
    createProcessService,
    updateProcessService,
    deleteProcessService,
    getProcessService,
    getAllProcessesService,
    getProcessByModuleIdService,
    getProcessNamesByModuleService,
    getProcessesBySiteService,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChecklistHistory = exports.updateChecklistHistory = exports.getChecklistHistoriesByLibrary = exports.getChecklistHistoryById = exports.createChecklistHistory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checklisthistory_modal_1 = __importDefault(require("./checklisthistory.modal"));
const upload_middleware_1 = require("../../../../upload/upload.middleware");
const createChecklistHistory = async (data) => {
    const newHistory = new checklisthistory_modal_1.default({
        checklistId: new mongoose_1.default.Types.ObjectId(data.checklistId),
        library: new mongoose_1.default.Types.ObjectId(data.library),
        comment: data.comment,
        createdBy: new mongoose_1.default.Types.ObjectId(data.createdBy),
        list: data.list.map(item => ({
            item: new mongoose_1.default.Types.ObjectId(item.item),
            yes: item.yes,
            no: item.no,
            partial: item.partial,
            comment: item.comment,
            evidenceKey: item.evidenceKey,
            evidence: item.evidence
        })),
    });
    return await newHistory.save();
};
exports.createChecklistHistory = createChecklistHistory;
const getChecklistHistoryById = async (id) => {
    const history = await checklisthistory_modal_1.default.findById(id)
        .populate('checklistId')
        .populate('library')
        .populate('createdBy')
        .populate('list.item');
    if (!history) {
        throw new Error('Checklist history not found');
    }
    return history;
};
exports.getChecklistHistoryById = getChecklistHistoryById;
const getChecklistHistoriesByLibrary = async (libraryId, page = 1, limit = 10) => {
    const match = { library: new mongoose_1.default.Types.ObjectId(libraryId) };
    const total = await checklisthistory_modal_1.default.countDocuments(match);
    const data = await checklisthistory_modal_1.default.find(match)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('checklistId')
        .populate('library')
        .populate('createdBy')
        .populate('list.item');
    return { data, total, page, limit };
};
exports.getChecklistHistoriesByLibrary = getChecklistHistoriesByLibrary;
const updateChecklistHistory = async (id, data) => {
    // 1. Fetch the existing document
    const oldHistory = await checklisthistory_modal_1.default.findById(id);
    if (!oldHistory) {
        throw new Error('Checklist history not found');
    }
    // 2. Track files to delete
    const filesToDelete = [];
    // 3. Compare list items
    if (data.list && oldHistory.list) {
        data.list.forEach((newItem) => {
            const oldItem = oldHistory.list.find((item) => item.item.toString() === newItem.item);
            if (oldItem && oldItem.evidenceKey && oldItem.evidenceKey !== newItem.evidenceKey) {
                filesToDelete.push(oldItem.evidenceKey);
            }
        });
    }
    // 4. Prepare update object
    const updateData = {};
    if (data.comment)
        updateData.comment = data.comment;
    if (data.list) {
        updateData.list = data.list.map(item => ({
            item: new mongoose_1.default.Types.ObjectId(item.item),
            yes: item.yes,
            no: item.no,
            partial: item.partial,
            comment: item.comment,
            evidenceKey: item.evidenceKey,
            evidence: item.evidence
        }));
    }
    // 5. Update document
    const updatedHistory = await checklisthistory_modal_1.default.findByIdAndUpdate(id, updateData, { new: true });
    // 6. Delete old files
    for (const fileKey of filesToDelete) {
        await (0, upload_middleware_1.deleteMedia)(fileKey);
    }
    return updatedHistory;
};
exports.updateChecklistHistory = updateChecklistHistory;
const deleteChecklistHistory = async (id) => {
    const history = await checklisthistory_modal_1.default.findByIdAndDelete(id);
    if (!history) {
        throw new Error('Checklist history not found');
    }
};
exports.deleteChecklistHistory = deleteChecklistHistory;

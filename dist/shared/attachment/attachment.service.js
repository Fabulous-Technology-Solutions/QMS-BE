"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentServices = void 0;
const upload_middleware_1 = require("../../modules/upload/upload.middleware");
class AttachmentServices {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const doc = new this.model(data);
        return await doc.save();
    }
    async update(id, updateData) {
        const doc = await this.model.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: false });
        if (!doc) {
            throw new Error('Attachment not found');
        }
        if (doc.fileKey) {
            await (0, upload_middleware_1.deleteMedia)(doc.fileKey);
        }
        Object.assign(doc, updateData);
        return doc;
    }
    async delete(id) {
        const doc = await this.model.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!doc)
            throw new Error('Document not found');
        return doc;
    }
    async getById(id) {
        const doc = await this.model.findOne({ _id: id, isDeleted: false });
        if (!doc)
            throw new Error('Document not found');
        return doc;
    }
    async getByLibrary(libraryId, page, limit, search) {
        const query = { library: libraryId, isDeleted: false };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const data = await this.model
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await this.model.countDocuments(query);
        return {
            data,
            total,
            page,
            limit,
            success: true,
            message: 'Retrieved successfully',
        };
    }
}
exports.AttachmentServices = AttachmentServices;

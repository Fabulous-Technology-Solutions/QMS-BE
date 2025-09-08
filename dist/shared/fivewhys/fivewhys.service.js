"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiveWhysServices = void 0;
class FiveWhysServices {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const fiveWhys = new this.model(data);
        return await fiveWhys.save();
    }
    async getById(id) {
        return await this.model.findById(id).populate('createdBy');
    }
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
    async getByLibrary(libraryId, page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const matchQuery = { library: libraryId };
        if (search) {
            matchQuery.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const fiveWhys = await this.model.aggregate([
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
        const total = await this.model.countDocuments(matchQuery);
        return { total, data: fiveWhys, page, limit, success: true };
    }
    async getNamesByLibrary(libraryId) {
        const docs = await this.model.find({ library: libraryId }, "name");
        if (!docs)
            throw new Error("Not found");
        return docs;
    }
}
exports.FiveWhysServices = FiveWhysServices;

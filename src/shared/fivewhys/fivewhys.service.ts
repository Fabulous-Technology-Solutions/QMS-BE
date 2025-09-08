import { Model, Document } from "mongoose";
import { CreateFiveWhysRequest } from "./fivewhys.interfaces";

export class FiveWhysServices<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: CreateFiveWhysRequest) {
        const fiveWhys = new this.model(data);
        return await fiveWhys.save();
    }

    async getById(id: string) {
        return await this.model.findById(id).populate('createdBy');
    }

    async update(id: string, data: Partial<CreateFiveWhysRequest>) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async getByLibrary(
        libraryId: string, 
        page: number = 1, 
        limit: number = 10,
        search?: string
    ) {
        const skip = (page - 1) * limit;
        const matchQuery: any = { library: libraryId };
        
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

    async getNamesByLibrary(libraryId: string) {
        const docs = await this.model.find({ library: libraryId }, "name");
        if (!docs) throw new Error("Not found");
        return docs;
    }
}

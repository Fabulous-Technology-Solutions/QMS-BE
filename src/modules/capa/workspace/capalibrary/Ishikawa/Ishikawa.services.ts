import Ishikawa from "./Ishikawa.modal";
import {createIshikawaRequest} from "./Ishikawa.interfaces"
import mongoose from "mongoose";

const createIshikawa = async (data: createIshikawaRequest) => {
    const newIshikawa = new Ishikawa(data);
    return await newIshikawa.save();
};

const getIshikawaById = async (id: string) => {
    return await Ishikawa.findById(id);
};

const getIshikawaByLibraryId = async (libraryId: string, page: number = 1, limit: number = 10, search?: string) => {
    const skip = (page - 1) * limit;

    const matchStage: any = { library: new mongoose.Types.ObjectId(libraryId) };
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

    const [result] = await Ishikawa.aggregate(pipeline);
    return {
        data: result.data,
        total: result.totalCount[0]?.count || 0,
        page,
        limit
    };
};

const deleteIshikawa = async (id: string) => {
    return await Ishikawa.findByIdAndDelete(id);
};

export {
    createIshikawa,
    getIshikawaById,
    getIshikawaByLibraryId,
    deleteIshikawa
}
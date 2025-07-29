import {CreateCausesRequest, GetCausesQuery} from "./causes.interfaces";
import  Causes from "./causes.modal";

export const createCauses = async (data: CreateCausesRequest) => {
    const causes = new Causes({
        name: data.name,
        description: data.description,
        library: data.library,
    });
    return await causes.save();
}

export const updateCauses = async (causesId: string, updateData: Partial<CreateCausesRequest>) => {
    const causes = await Causes.findOneAndUpdate(
        { _id: causesId, isDeleted: false },
        updateData,
        { new: true }
    );
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};

export const deleteCauses = async (causesId: string) => {
    const causes = await Causes.findOneAndUpdate(
        { _id: causesId, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};  

export const getCausesById = async (causesId: string) => {
    const causes = await Causes.findOne({ _id: causesId, isDeleted: false });
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
};

export const getCausesByLibrary = async (libraryId: string, page: number, limit: number, search: string) => {
    const query:GetCausesQuery = { library: libraryId, isDeleted: false };

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const causes = await Causes.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Causes.countDocuments(query);
    return {
        data: causes,
        total,
        page,
        limit,
        success: true,
        message: 'Causes retrieved successfully',
    };
};

export const getNamesByLibrary = async (libraryId: string) => {
    const causes = await Causes.find({ library: libraryId, isDeleted: false }, 'name');
    if (!causes) {
        throw new Error('Causes not found');
    }
    return causes;
}
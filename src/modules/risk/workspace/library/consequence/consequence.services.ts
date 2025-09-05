import ConsequenceModel from "./consequence.modal";
import {ConsequenceInput} from "./consequence.interfaces";
import AppiError from "../../../../errors/ApiError";
export const createConsequence = async (input: ConsequenceInput) => {
  const consequence = new ConsequenceModel(input);
  return await consequence.save();
};

export const getConsequencesByLibrary = async (
    libraryId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
) => {
    const skip = (page - 1) * limit;
    
    const query: any = { library: libraryId };
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    
    const [consequences, total] = await Promise.all([
        ConsequenceModel.find(query).skip(skip).limit(limit),
        ConsequenceModel.countDocuments(query)
    ]);
    
    return {
        consequences,
        total,
        page,
        limit
    };
};

export const getConsequenceById = async (id: string) => {
    const consequence = await ConsequenceModel.findById(id);
    if (!consequence) {
        throw new AppiError("Consequence not found", 404);
    }
    return consequence;
};

export const updateConsequence = async (id: string, updateData: Partial<ConsequenceInput>) => {
    const consequence = await ConsequenceModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!consequence) {
        throw new AppiError("Consequence not found", 404);
    }
    return consequence;
};

export const deleteConsequence = async (id: string) => {
    const consequence = await ConsequenceModel.findByIdAndDelete(id);
    if (!consequence) {
        throw new AppiError("Consequence not found", 404);
    }
    return consequence;
};
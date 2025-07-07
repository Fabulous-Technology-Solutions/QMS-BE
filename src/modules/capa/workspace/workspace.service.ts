import mongoose from "mongoose";
import { CreateCapaworkspaceRequest, getworkspacesofuserRequest, IqueryofGetworkspaces } from "./workspace.interfaces";
import CapaworkspaceModel from "./workspace.modal";

export const createCapaworkspace = async (data: CreateCapaworkspaceRequest) => {
    const workspace = new CapaworkspaceModel(data);
    return await workspace.save();
} 

export const getAllCapaworkspaces = async (body: getworkspacesofuserRequest) => {
    const { moduleId, Page, Limit, user } = body;
    const page = Page || 1;
    const limit = Limit || 10;
    const skip = (page - 1) * limit;

    const query: IqueryofGetworkspaces = {
        moduleId: new mongoose.Types.ObjectId(moduleId)
    };

    // If user is not admin, filter by their created workspaces
    if (user.role !== "admin") {
        query.createdBy = new mongoose.Types.ObjectId(user._id);
    }

    const results = await CapaworkspaceModel.aggregate([
        { $match: query },
        {
            $lookup: {
                from: 'modules',
                localField: 'moduleId',
                foreignField: '_id',
                as: 'module'
            }
        },
        {
            $unwind: {
                path: '$module',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdByUser'
            }
        },
        {
            $unwind: {
                path: '$createdByUser',
                preserveNullAndEmptyArrays: true
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);

    return results;
};

export const getCapaworkspaceById = async (workspaceId: string) => {
    return await CapaworkspaceModel.findById(workspaceId)
        .populate('moduleId', 'name')
        .populate('createdBy', 'name email');
}


export const updateCapaworkspace = async (workspaceId: string, data: Partial<CreateCapaworkspaceRequest>) => {


    return await CapaworkspaceModel.findByIdAndUpdate(workspaceId, data, { new: true });
}

export const deleteCapaworkspace = async (workspaceId: string) => {
    return await CapaworkspaceModel.findByIdAndUpdate(workspaceId, { isDeleted: true }, { new: true });
}
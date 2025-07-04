import { CreateCapaworkspaceRequest, getworkspacesofuserRequest } from "./workspace.interfaces";
import CapaworkspaceModel from "./workspace.modal";

export const createCapaworkspace = async (data: CreateCapaworkspaceRequest) => {
    const workspace = new CapaworkspaceModel(data);
    return await workspace.save();
} 

export const getAllCapaworkspaces = async (body:getworkspacesofuserRequest) => {
    const { moduleId, Page, Limit, user } = body;
    const page = Page || 1;
    const limit = Limit || 10;
    const skip = (page - 1) * limit;

    const query:any={
        moduleId: moduleId
    }

    if(user.role==="admin"){
        query['createdBy'] = user?._id;

    }

    const results = await CapaworkspaceModel.aggregate([
        { $match: { moduleId } },
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
}
import {CreateGroupRequest, GetGroupsParams, GetGroupsQuery} from "./group.interfaces"
import GroupModel from "./group.modal";



export const CreateGroup=async (groupData: CreateGroupRequest) => {
    const group = new GroupModel(groupData);
    return await group.save();
}


export const getGroupById = async (groupId: string) => {
    return await GroupModel.findById(groupId).populate('members', 'name email profilePicture');
};

export const getGroupsByWorkspace = async (body:GetGroupsParams) => {

    const query: GetGroupsQuery = { workspace: body.workspace,isDeleted: false };
    if (body.search) {
        query.name = { $regex: body.search, $options: 'i' };
    }

    return await GroupModel.find(query)
        .skip((body.page - 1) * body.limit)
        .limit(body.limit)
        .populate('members', 'name email profilePicture');
};

export const updateGroup = async (groupId: string, updateData: Partial<CreateGroupRequest>) => {
    return await GroupModel.findByIdAndUpdate(groupId, updateData, { new: true })
        .populate('members', 'name email profilePicture');
};


export const deleteGroup = async (groupId: string) => {
    return await GroupModel.findByIdAndUpdate(groupId, { isDeleted: true }, { new: true });
}

export const getGroupsNames = async (workspaceId: string) => {
    return await GroupModel.find({ workspace: workspaceId, isDeleted: false }, 'name')
       
}
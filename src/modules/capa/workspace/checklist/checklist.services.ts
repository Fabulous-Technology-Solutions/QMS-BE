import {CreateChecklistRequest} from "./checklist.interface"
import Checklist  from "./checklist.modal"

const createCheckList= async (data: CreateChecklistRequest) => {
    const checklist = new Checklist(data);
    await checklist.save();
    return checklist;
}

const getCheckListById = async (checklistId: string) => {
    const checklist = await Checklist.findOne({ _id: checklistId, isDelete: false })
        .populate('workspace', 'name description');

    if (!checklist) {
        throw new Error('Checklist not found');
    }
    return checklist;
};
const updateCheckList = async (checklistId: string, data: Partial<CreateChecklistRequest>) => {
    const checklist = await Checklist.findOneAndUpdate({ _id: checklistId, isDelete: false }, data, { new: true });
    if (!checklist) {   
        throw new Error('Checklist not found');
    }
    return checklist;
};

const deleteCheckList = async (checklistId: string) => {
    const checklist = await Checklist.findOneAndUpdate({ _id: checklistId }, { isDelete: true }, { new: true });
    if (!checklist) {
        throw new Error('Checklist not found');
    }
    return checklist;
};

const getCheckListByWorkspaceId = async (workspaceId: string) => {
    const checklists = await Checklist.find({ workspace: workspaceId, isDelete: false })
        .populate('workspace', 'name description');
    return checklists;
};

export {
    createCheckList,
    getCheckListById,
    updateCheckList,
    deleteCheckList,
    getCheckListByWorkspaceId
};

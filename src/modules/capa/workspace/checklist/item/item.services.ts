import { deleteMedia } from "../../../../upload/upload.middleware";
import {CreateCheckListItemRequest} from "./item.interface"

import CheckListItem from './item.modal';

const createCheckListItem = async (data: CreateCheckListItemRequest) => {
    const checkListItem = new CheckListItem(data);
    await checkListItem.save();
    return checkListItem;
};

const getCheckListItemById = async (itemId: string) => {
    const checkListItem = await CheckListItem.findOne({ _id: itemId, isDelete: false })
        .populate('checklist', 'name description');

    if (!checkListItem) {
        throw new Error('Checklist item not found');
    }
    return checkListItem;
};          

const updateCheckListItem = async (itemId: string, data: Partial<CreateCheckListItemRequest>) => {
    const checkListItem = await CheckListItem.findOneAndUpdate(
        { _id: itemId, isDelete: false },
        data,
        { new: false }
    );
    if (!checkListItem) {
        throw new Error('Checklist item not found');
    }
    if (data.evidenceKey!== checkListItem.evidenceKey) {
      await deleteMedia(checkListItem.evidenceKey);
    }
    return checkListItem;
};
const deleteCheckListItem = async (itemId: string) => {
    const checkListItem = await CheckListItem.findOneAndUpdate(
        { _id: itemId, isDelete: false },
        { isDelete: true },
        { new: true }
    );

    if (!checkListItem) {
        throw new Error('Checklist item not found');
    }
    return checkListItem;
};
const getCheckListItemsByChecklistId = async (checklistId: string) => {
    const checkListItems = await CheckListItem.find({ checklist: checklistId, isDelete: false })
        .populate('checklist', 'name description');
    return checkListItems;
};


export {
    createCheckListItem,
    getCheckListItemById,
    updateCheckListItem,
    deleteCheckListItem,
    getCheckListItemsByChecklistId
};
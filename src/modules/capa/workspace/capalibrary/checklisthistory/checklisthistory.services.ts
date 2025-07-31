import mongoose from 'mongoose';
import { createChecklistHistory as ICreateChecklistHistory, ChecklistHistoryModal } from './checklisthistory.interfaces';
import ChecklistHistory from './checklisthistory.modal';

export const createChecklistHistory = async (
  data: ICreateChecklistHistory
): Promise<ChecklistHistoryModal> => {
  const newHistory = new ChecklistHistory({
    checklistId: new mongoose.Types.ObjectId(data.checklistId),
    library: new mongoose.Types.ObjectId(data.library),
    comment: data.comment,
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
    list: data.list.map(item => ({
      item: new mongoose.Types.ObjectId(item.item),
      yes: item.yes,
      no: item.no,
      partial: item.partial,
    })),
  });
  return await newHistory.save();
};
export const getChecklistHistoryById = async (
  id: string
): Promise<ChecklistHistoryModal> => {
  const history = await ChecklistHistory.findById(id)
    .populate('checklistId')
    .populate('library')
    .populate('createdBy')
    .populate('list.item');
  if (!history) {
    throw new Error('Checklist history not found');
  }
  return history;
};
export const getChecklistHistoriesByLibrary = async (
  libraryId: string,
  page = 1,
  limit = 10
) => {
  const match = { library: new mongoose.Types.ObjectId(libraryId) };
  const total = await ChecklistHistory.countDocuments(match);
  const data = await ChecklistHistory.find(match)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('checklistId')
    .populate('library')
    .populate('createdBy')
    .populate('list.item');
  return { data, total, page, limit };
};
export const updateChecklistHistory = async (
  id: string,
  data: Partial<ICreateChecklistHistory>
): Promise<ChecklistHistoryModal> => {
  const updateData: any = {};
  if (data.comment) updateData.comment = data.comment;
  if (data.list) {
    updateData.list = data.list.map(item => ({
      item: new mongoose.Types.ObjectId(item.item),
      yes: item.yes,
      no: item.no,
      partial: item.partial,
    }));
  }
  const history = await ChecklistHistory.findByIdAndUpdate(id, updateData, { new: true });
  if (!history) {
    throw new Error('Checklist history not found');
  }
  return history;
};
export const deleteChecklistHistory = async (id: string): Promise<void> => {
  const history = await ChecklistHistory.findByIdAndDelete(id);
  if (!history) {
    throw new Error('Checklist history not found');
  }
};


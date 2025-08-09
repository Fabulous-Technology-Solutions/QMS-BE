import mongoose from 'mongoose';
import { createChecklistHistory as ICreateChecklistHistory, ChecklistHistoryModal } from './checklisthistory.interfaces';
import ChecklistHistory from './checklisthistory.modal';
import { deleteMedia } from '../../../../upload/upload.middleware';

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
      comment:item.comment,
      evidenceKey:item.evidenceKey,
      evidence:item.evidence
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
  // 1. Fetch the existing document
  const oldHistory = await ChecklistHistory.findById(id);
  if (!oldHistory) {
    throw new Error('Checklist history not found');
  }

  // 2. Track files to delete
  const filesToDelete: string[] = [];

  // 3. Compare list items
  if (data.list && oldHistory.list) {
    data.list.forEach((newItem) => {
      const oldItem = oldHistory.list.find(
        (item) => item.item.toString() === newItem.item
      );
      if (oldItem && oldItem.evidenceKey && oldItem.evidenceKey !== newItem.evidenceKey) {
        filesToDelete.push(oldItem.evidenceKey);
      }
    });
  }

  // 4. Prepare update object
  const updateData: any = {};
  if (data.comment) updateData.comment = data.comment;
  if (data.list) {
    updateData.list = data.list.map(item => ({
      item: new mongoose.Types.ObjectId(item.item),
      yes: item.yes,
      no: item.no,
      partial: item.partial,
      comment: item.comment,
      evidenceKey: item.evidenceKey,
      evidence: item.evidence
    }));
  }

  // 5. Update document
  const updatedHistory = await ChecklistHistory.findByIdAndUpdate(id, updateData, { new: true });

  // 6. Delete old files
  for (const fileKey of filesToDelete) {
    await deleteMedia(fileKey);
  }

  return updatedHistory!;
};

export const deleteChecklistHistory = async (id: string): Promise<void> => {
  const history = await ChecklistHistory.findByIdAndDelete(id);
  if (!history) {
    throw new Error('Checklist history not found');
  }
};


import mongoose, { Document } from 'mongoose';

export interface ChecklistHistoryModal extends Document {
  checklistId: mongoose.Types.ObjectId;
  library: mongoose.Types.ObjectId;
  comment: string;
  createdBy: mongoose.Types.ObjectId;
  list: [
    {
      item: mongoose.Types.ObjectId;
      yes: boolean;
      no: boolean;
      partial: boolean;
    }
  ];
}

export interface createChecklistHistory {
  checklistId: string;
  library: string;
  comment: string;
  createdBy: string;
  list: [
    {
      item: string;
      yes: boolean;
      no: boolean;
      partial: boolean;
    }
  ];
}

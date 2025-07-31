import { CheckListItemModal } from './item.interface';

import mongoose from 'mongoose';

const checkListItemSchema = new mongoose.Schema<CheckListItemModal>({
  question: { type: String, required: true },
  checklist: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true },
  evidence: { type: String, required: true },
  evidenceKey: { type: String, required: true },
  comment: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
});

const CheckListItem = mongoose.model<CheckListItemModal>('CheckListItem', checkListItemSchema);

export default CheckListItem;

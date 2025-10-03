  import { ChecklistHistoryModal } from './checklisthistory.interfaces';
  import mongoose from 'mongoose';

  const ChecklistHistorySchema = new mongoose.Schema(
    {
      checklistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true },
      library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
      comment: { type: String, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      list: [
        {
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckListItem', required: true },
          yes: { type: Boolean, required: true }, 
          no: { type: Boolean, required: true },
          partial: { type: Boolean, required: true },
          evidence: { type: String},
          evidenceKey: { type: String },  
          comment: { type: String},
        },
      ],
    },
    { timestamps: true }
  );

  const ChecklistHistory = mongoose.model<ChecklistHistoryModal>('ChecklistHistory', ChecklistHistorySchema);

  export default ChecklistHistory;

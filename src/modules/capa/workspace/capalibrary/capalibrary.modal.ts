import Action from './action/action.modal';
import { LibraryModal } from './capalibrary.interfaces';
import mongoose from 'mongoose';
import Causes from './causes/causes.modal';
import ChecklistHistory from './checklisthistory/checklisthistory.modal';
import AttachmentModal from './attachment/attachment.modal';
import { deleteMedia } from '../../../upload/upload.middleware';


const LibrarySchema = new mongoose.Schema<LibraryModal>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    status: { type: String, enum: ['pending', 'completed', 'in-progress'], default: 'pending' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    
    Form5W2H: {
      containment: {
        type: Boolean,
        default: false,
      },
      containmentDetails: {
        type: String,
        required: function (this: LibraryModal) {
          return this.Form5W2H.containment;
        },
        default: null,
      },
      what: { type: String, default: null },
      why: { type: String, default: null },
      when: { type: String, default: null },
      where: { type: String, default: null },
      who: { type: String, default: null },
      how: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
LibrarySchema.pre('findOneAndDelete', async function (next) {
  const libraryId = this.getQuery()['_id'];
  const actions = await Action.find({ library: libraryId });
  const attachments = await AttachmentModal.find({ library: libraryId });
  actions.forEach(async (action) => {
    if (action.docfileKey) {
      await deleteMedia(action.docfileKey);
    }
  });
  attachments.forEach(async (attachment) => {
    if (attachment.fileKey) {
      await deleteMedia(attachment.fileKey);
    }
  });
  // Delete related documents in other collections
  await Action.deleteMany({ library: libraryId });
  await Causes.deleteMany({ library: libraryId });
  await ChecklistHistory.deleteMany({ library: libraryId });
  await AttachmentModal.deleteMany({ library: libraryId });

  next();
});
export const LibraryModel = mongoose.model<LibraryModal>('Library', LibrarySchema);

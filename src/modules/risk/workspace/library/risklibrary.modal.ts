
import { deleteMedia } from '../../../upload/upload.middleware';
import Action from './action/action.modal';
import AttachmentModal from './attachment/attachment.modal';
import { LibraryModal } from './risklibrary.interfaces';
import mongoose from 'mongoose';
import Causes from './causes/causes.modal';
import FiveWhysModel from './fivewhys/fivewhys.modal';
import IshikawaModel from './Ishikawa/Ishikawa.modal';
import ControlModel from './control/control.modal';
import ConsequenceModel from './consequence/consequence.modal';
import AssessmentModel from './assessment/assessment.modal';

const LibrarySchema = new mongoose.Schema<LibraryModal>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    status: { type: String, enum: ['pending', 'completed', 'in-progress'], default: 'pending' },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category:{
      type: String,
      enum: ['Financial', 'Operational', 'Strategic', 'Compliance', 'Reputational'],
      required: true
    },
    dateIdentified: { type: Date, default: null },
    site:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site'
    },
    process:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Process'
    },
    riskappetite:{
      type: Number,
      min: 1,
      max: 25,
      default: null
    },
    assessmentApproval:{
      status: { type: String, enum: ['Reviewed', 'Approved', 'Draft'], default: 'Draft' },
      feedback: { type: String, default: '' },
    }
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
  const assessments= await AssessmentModel.find({ library: libraryId });
  

  actions?.forEach(async (action) => {
    if (action.docfileKey) {
      await deleteMedia(action.docfileKey);
    }
  });
  attachments?.forEach(async (attachment) => {
    if (attachment.fileKey) {
      await deleteMedia(attachment.fileKey);
    }
  });
  assessments?.forEach(async (assessment) => {
    if (assessment.templateKey) {
      await deleteMedia(assessment.templateKey as string);
    }
  });
  // Delete related documents in other collections
  await Action.deleteMany({ library: libraryId });
  await FiveWhysModel.deleteMany({ library: libraryId });
  await IshikawaModel.deleteMany({ library: libraryId });
  await Causes.deleteMany({ library: libraryId });
  await AttachmentModal.deleteMany({ library: libraryId });
  await ControlModel.deleteMany({ library: libraryId });
  await ConsequenceModel.deleteMany({ library: libraryId });
  await AssessmentModel.deleteMany({ library: libraryId });
  next();
});

export const LibraryModel = mongoose.model<LibraryModal>('RiskLibrary', LibrarySchema);

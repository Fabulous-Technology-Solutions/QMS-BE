
import { LibraryModal } from './risklibrary.interfaces';
import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema<LibraryModal>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },

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

export const LibraryModel = mongoose.model<LibraryModal>('RiskLibrary', LibrarySchema);

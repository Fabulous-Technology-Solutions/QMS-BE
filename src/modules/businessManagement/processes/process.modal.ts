import mongoose from "mongoose";
import {ProcessModal} from "./process.interfaces"
const processSchema = new mongoose.Schema<ProcessModal>({
  name: { type: String, required: true, maxlength: 100 },
  location: { type: String, required: true, maxlength: 100 },
  parentSite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Site" }],
  note: { type: String, required: true, maxlength: 500 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }],
  subProcesses: [{ type: String }],
  status: { type: Boolean, default: true },

});

const ProcessModel = mongoose.model<ProcessModal>("Process", processSchema);

export default ProcessModel;

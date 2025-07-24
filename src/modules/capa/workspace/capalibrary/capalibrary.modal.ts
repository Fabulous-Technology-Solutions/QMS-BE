import {LibraryModal} from "./capalibrary.interfaces"
import mongoose  from "mongoose";

const LibrarySchema = new mongoose.Schema<LibraryModal>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isDeleted: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "completed", "in-progress"], default: "pending" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},{
    timestamps: true,
    versionKey: false
});

export const LibraryModel = mongoose.model<LibraryModal>("Library", LibrarySchema);

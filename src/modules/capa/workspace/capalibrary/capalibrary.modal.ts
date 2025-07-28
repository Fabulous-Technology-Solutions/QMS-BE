import { LibraryModal } from "./capalibrary.interfaces"
import mongoose from "mongoose";

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
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  Form5W2H: {
    containment: {
      type: Boolean,
      default: false
    },
    what: { type: String, default: null },
    why: { type: String, default: null },
    when: { type: String, default: null },
    where: { type: String, default: null },
    who: { type: String, default: null },
    how: { type: String, default: null }
  }
}, {
  timestamps: true,
  versionKey: false
});

export const LibraryModel = mongoose.model<LibraryModal>("Library", LibrarySchema);

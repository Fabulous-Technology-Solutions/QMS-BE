import mongoose from "mongoose";
import { ChecklistModal } from "./checklist.interface";

const checklistSchema = new mongoose.Schema<ChecklistModal>({
    name: { type: String },
    description: { type: String },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    isDelete: { type: Boolean, default: false },
});

const Checklist = mongoose.model<ChecklistModal>("Checklist", checklistSchema);

export default Checklist;
            
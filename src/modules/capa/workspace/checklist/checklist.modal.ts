import mongoose from "mongoose";
import { ChecklistModal } from "./checklist.interface";

const checklistSchema = new mongoose.Schema<ChecklistModal>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Capaworkspace", required: true },
    isDelete: { type: Boolean, default: false },
});

const Checklist = mongoose.model<ChecklistModal>("Checklist", checklistSchema);

export default Checklist;
            
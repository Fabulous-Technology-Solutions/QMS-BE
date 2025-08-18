import {ReportHistory} from "./reporthistory.interfaces"
import mongoose from "mongoose";

const reportHistorySchema = new mongoose.Schema<ReportHistory>({
  library: { type: mongoose.Schema.Types.ObjectId, ref: "Library" },
  file: { type: String, required: true },
  fileKey: { type: String, required: true }
},{
    timestamps: true
});

const ReportHistoryModel = mongoose.model<ReportHistory>("ReportHistory", reportHistorySchema);

export default ReportHistoryModel;

import mongoose, { Document } from "mongoose";


export interface ReportHistory extends Document {
  library: mongoose.Schema.Types.ObjectId;
  file: string;
  fileKey: string;
}

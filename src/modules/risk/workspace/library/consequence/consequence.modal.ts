import {Consequence} from "./consequence.interfaces";
import mongoose, {Schema} from "mongoose";

const consequenceSchema = new Schema<Consequence>({
  library: { type: Schema.Types.ObjectId, ref: "RiskLibrary", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

 const ConsequenceModel = mongoose.model<Consequence>("Consequence", consequenceSchema);
 export default ConsequenceModel;

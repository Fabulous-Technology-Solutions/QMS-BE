import mongoose from "mongoose";
import {FiveWhysModal} from "./fivewhys.interfaces"

const FiveWhysSchema = new mongoose.Schema<FiveWhysModal>({
  library: { type: String, required: true, minlength: 24, maxlength: 24 },
  problem: { type: String, required: true, maxlength: 500 },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  list: [
    {
      question: { type: String, required: true, maxlength: 200 },
      answer: { type: String, required: true, maxlength: 500 },
    },
  ],
});

const FiveWhysModel = mongoose.model<FiveWhysModal>("FiveWhys", FiveWhysSchema);

export default FiveWhysModel;

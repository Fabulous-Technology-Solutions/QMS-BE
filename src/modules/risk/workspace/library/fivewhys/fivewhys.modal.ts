import mongoose from "mongoose";
import { FiveWhysModal } from "../../../../../shared/fivewhys/fivewhys.interfaces";
import FiveWhysSchema from "../../../../../shared/fivewhys/fivewhys.modal";
const FiveWhysModel = mongoose.model<FiveWhysModal>("RiskFiveWhys", FiveWhysSchema);

export default FiveWhysModel;

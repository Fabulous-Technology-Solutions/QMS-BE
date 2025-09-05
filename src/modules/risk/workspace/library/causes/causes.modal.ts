import mongoose from "mongoose";
import {CausesModal} from '../../../../../shared/cause/cause.interfaces';
import CausesSchema from "../../../../../shared/cause/cause.schema";
const Causes = mongoose.model<CausesModal>('RiskCauses', CausesSchema);
export default Causes;
import mongoose from "mongoose";
import {CausesModal} from '../../../../../shared/cause/cause.interfaces';
import CausesSchema from "../../../../../shared/cause/cause.schema";
CausesSchema.add({
     library: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskLibrary', required: true }
})
const Causes = mongoose.model<CausesModal>('RiskCauses', CausesSchema);
export default Causes;
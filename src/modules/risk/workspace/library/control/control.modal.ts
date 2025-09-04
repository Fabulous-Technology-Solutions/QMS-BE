import {ControlModal} from './control.interfaces';
import mongoose from 'mongoose';
const controlSchema = new mongoose.Schema<ControlModal>(
  {
    name: { type: String, required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    description: { type: String, required: true },
    controlType: { type: String, required: true },
    effectiveness: { type: String, required: true },
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

 const ControlModel = mongoose.model<ControlModal>('Control', controlSchema);
    export default ControlModel;
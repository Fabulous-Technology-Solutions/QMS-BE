import IshikawaSchema from '../../../../../shared/ishikawa/ishikawa.schema';
import mongoose from 'mongoose';
import { CreateIshikawa } from '../../../../../shared/ishikawa/ishikawa.interfaces';


IshikawaSchema.add({
     library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true }
})

const IshikawaModel = mongoose.model<CreateIshikawa>('Ishikawa', IshikawaSchema);

export default IshikawaModel;

import { CreateIshikawa as ICreateIshikawa } from './Ishikawa.interfaces';
import mongoose from 'mongoose';

const IshikawaSchema = new mongoose.Schema<ICreateIshikawa>(
  {
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problems: [
      {
        problem: { type: String, required: true },
        category: [
          {
            name: { type: String, required: true },
            cause: [
              {
                name: {
                  type: String,
                  required: true,
                },
                subCauses: [
                  {
                    type: String,
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const IshikawaModel = mongoose.model<ICreateIshikawa>('Ishikawa', IshikawaSchema);

export default IshikawaModel;

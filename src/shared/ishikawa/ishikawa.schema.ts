import { CreateIshikawa as ICreateIshikawa } from './ishikawa.interfaces';
import mongoose from 'mongoose';

const IshikawaSchema = new mongoose.Schema<ICreateIshikawa>(
  {
 
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

export default IshikawaSchema;
import mongoose from 'mongoose';

export interface FiveWhysModal extends mongoose.Document {
  library: mongoose.Schema.Types.ObjectId;
  problem: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  list: {
    question: string;
    answer: string;
  }[];
}

export interface CreateFiveWhysRequest {
  library: mongoose.Schema.Types.ObjectId;
  problem: string;
  list: {
    question: string;
    answer: string;
  }[];
}


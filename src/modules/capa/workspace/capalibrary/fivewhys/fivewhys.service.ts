import FiveWhysModel from './fivewhys.modal';
import { CreateFiveWhysRequest } from './fivewhys.interfaces';

const createFiveWhys = async (data: CreateFiveWhysRequest) => {
  const fiveWhys = new FiveWhysModel(data);
  return await fiveWhys.save();
};

const getFiveWhys = async (id: string) => {
  return await FiveWhysModel.findById(id).populate('createdBy');
};

const updateFiveWhys = async (id: string, data: Partial<CreateFiveWhysRequest>) => {
  return await FiveWhysModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteFiveWhys = async (id: string) => {
  return await FiveWhysModel.findByIdAndDelete(id);
};

const getFiveWhysByLibrary = async (libraryId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return await FiveWhysModel.aggregate([
    { $match: { library: libraryId } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users', // replace with your actual users collection name
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
  ]);
};

export {
  createFiveWhys,
  getFiveWhys,
  updateFiveWhys,
  deleteFiveWhys,
  getFiveWhysByLibrary,
};

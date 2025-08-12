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
const getFiveWhysByLibrary = async (
  libraryId: string, 
  page: number = 1, 
  limit: number = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const matchQuery: any = { library: libraryId };
  
  if (search) {
    matchQuery.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const fiveWhys = await FiveWhysModel.aggregate([
    { $match: matchQuery },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
  ]);

  const total = await FiveWhysModel.countDocuments(matchQuery);
  return { total, data:fiveWhys, page, limit, success: true };
};

export {
  createFiveWhys,
  getFiveWhys,
  updateFiveWhys,
  deleteFiveWhys,
  getFiveWhysByLibrary,
};

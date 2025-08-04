import { GetLogsByIdOptions } from "./activitylogs.interfaces";
import ActivityLog from "./activitylogs.modal";



const getlogsByid = async (
  id: string,
  options: GetLogsByIdOptions = {}
) => {
  if (!id) {
    throw new Error("documentId and collectionName are required");
  }

  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const logs = await ActivityLog.find({ logof: id })
    .populate('performedBy', 'name email profilePicture role').select('-__v -changes')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ActivityLog.countDocuments({ logof: id });

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export  {
  getlogsByid
};
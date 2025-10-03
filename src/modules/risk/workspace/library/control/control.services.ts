import ControlModel from './control.modal';
import { CreateControl } from './control.interfaces';
import ApiError from '../../../../errors/ApiError';

const createActionService = async (data: CreateControl) => {
  const control = new ControlModel(data);
  return control.save();
}

const getAllControlService = async (libraryId: string, page: number = 1, limit: number = 10, search?: string) => {
  const skip = (page - 1) * limit;

  const matchStage: any = { library: libraryId };

  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  

  const result = await ControlModel.aggregate([
    { $match: matchStage },
     {
        $lookup: {
          from: 'accounts',
          localField: 'owners',
          foreignField: '_id',
          as: 'owners',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
              },
            },
            { $unwind: { path: '$user' } },
            {
              $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
            },
          ],
        },
      },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        controls: [
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: "total" }
        ]
      }
    }
  ]);
  const controls = result[0].controls;
  const total = result[0].totalCount[0]?.total || 0;

  return {
    controls,
    total,
    page,
    limit
  };
}

const getControlByIdService = async (id: string) => {
  const result = await ControlModel.aggregate([
    { $match: { _id: new (require('mongoose')).Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'accounts',
        localField: 'owners',
        foreignField: '_id',
        as: 'owners',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
          },
          { $unwind: { path: '$user' } },
          {
            $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
          },
        ],
      },
    }
  ]);

  const control = result[0];
  if (!control) {
    throw new ApiError('Control not found', 404);
  }
  return control;
}
const updateControlService = async (id: string, data: Partial<CreateControl>) => {
  const control = await ControlModel.findByIdAndUpdate(id, data, { new: true });
  if (!control) {
    throw new ApiError('Control not found', 404);
  }
  return control;
}
const deleteControlService = async (id: string) => {
  const control = await ControlModel.findByIdAndDelete(id);
    if (!control) {
        throw new ApiError('Control not found', 404);
    }

    return control;
}

export {
  createActionService,
  getAllControlService,
  getControlByIdService,
  updateControlService,
  deleteControlService
};
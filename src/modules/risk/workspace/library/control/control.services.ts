import ControlModel from './control.modal';
import { CreateControl, GetControlQuery } from './control.interfaces';
import ApiError from '../../../../errors/ApiError';

const createActionService = async (data: CreateControl) => {
  const control = new ControlModel(data);
  return control.save();
}

const getAllControlService = async (libraryId: string, page: number = 1, limit: number = 10, search?: string) => {
  const skip = (page - 1) * limit;

  const query:GetControlQuery = { library: libraryId };

  if (search) {
      query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
      ];
  }

  const controls = await ControlModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

  const total = await ControlModel.countDocuments(query);

  return {
      controls,
        total,
        page,
        limit
  };
}

const getControlByIdService = async (id: string) => {
  const control = await ControlModel.findById(id);
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
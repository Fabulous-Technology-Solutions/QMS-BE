import mongoose from 'mongoose';
import { CreateCapaworkspaceRequest, CreateCapaworkspaceServiceFunction, getworkspacesofuserRequest, IMAP, IqueryofGetworkspaces } from './workspace.interfaces';
import CapaworkspaceModel from './workspace.modal';

export const createCapaworkspace = async (data: CreateCapaworkspaceServiceFunction) => {
  const { moduleId, name, imageUrl, imagekey, description, user } = data;

  const workspace = new CapaworkspaceModel({
    moduleId,
    name,
    imageUrl,
    imagekey,     
    description,
    createdBy: user._id,  
  });
  if (user.role !== 'admin') {
    (user.adminOF as IMAP[] | undefined)?.forEach((admin: IMAP) => {
      if (admin.method.equals(moduleId)) {
        admin.workspacePermissions.push(workspace._id);
      }
    });
  }
  await user.save();
  return await workspace.save();
};

export const getAllCapaworkspaces = async (body: getworkspacesofuserRequest) => {
  const { moduleId, Page, Limit, user, search } = body;
  const page = Page || 1;
  const limit = Limit || 10;
  const skip = (page - 1) * limit;

  const query: IqueryofGetworkspaces = {
    moduleId: new mongoose.Types.ObjectId(moduleId),
    isDeleted: false,
  };
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (user.role !== 'admin') {
    const adminData = (user.adminOF as IMAP[] | undefined)?.find((admin) => admin.method.equals(moduleId));
    if (
      adminData?.workspacePermissions &&
      Array.isArray(adminData.workspacePermissions) &&
      adminData.workspacePermissions.length > 0
    ) {
      query._id = { $in: adminData?.workspacePermissions || [] };
    } else {
      return { results: [], total: 0 };
    }
  }

  const [results, totalCountArr] = await Promise.all([
    CapaworkspaceModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'modules',
          localField: 'moduleId',
          foreignField: '_id',
          as: 'module',
        },
      },
      {
        $unwind: {
          path: '$module',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]),
    CapaworkspaceModel.countDocuments(query),
  ]);

  return { results, total: totalCountArr, page };
};

export const getCapaworkspaceById = async (workspaceId: string) => {
  return await CapaworkspaceModel.findOne({ _id: workspaceId, isDeleted: false })
    .populate('moduleId', 'name')
    .populate('createdBy', 'name email');
};

export const updateCapaworkspace = async (workspaceId: string, data: Partial<CreateCapaworkspaceRequest>) => {
  return await CapaworkspaceModel.findOneAndUpdate({ _id: workspaceId, isDeleted: false }, data, { new: true });
};

export const deleteCapaworkspace = async (workspaceId: string) => {
  return await CapaworkspaceModel.findOneAndUpdate(
    { _id: workspaceId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

import mongoose from 'mongoose';
import { CreateCapaworkspaceRequest, getworkspacesofuserRequest, IMAP, IqueryofGetworkspaces } from './workspace.interfaces';
import CapaworkspaceModel from './workspace.modal';

export const createCapaworkspace = async (data: CreateCapaworkspaceRequest) => {
  const workspace = new CapaworkspaceModel(data);
  return await workspace.save();
};

  export const getAllCapaworkspaces = async (body: getworkspacesofuserRequest) => {
    const { moduleId, Page, Limit, user } = body;
    const page = Page || 1;
    const limit = Limit || 10;
    const skip = (page - 1) * limit;

    console.log('getAllCapaworkspaces called with moduleId:', moduleId, 'Page:', page, 'Limit:', limit, 'user:', user);

    const query: IqueryofGetworkspaces = {
      moduleId: new mongoose.Types.ObjectId(moduleId),
      isDeleted: false,
    };

    // If user is not admin, filter by their created workspaces
    if (user.role !== 'admin') {
      // Ensure user.adminOF is an array of IMAP and IMAP has a 'method' property
      const adminData = (user.adminOF as IMAP[] | undefined)?.find((admin) => 
        admin.method.equals(moduleId)
      );
      console.log('Admin data for user:', adminData);

      if (
        adminData?.workspacePermissions &&
        Array.isArray(adminData.workspacePermissions) &&
        adminData.workspacePermissions.length > 0
      ) {
        query._id = { $in: adminData?.workspacePermissions || [] };
      } else {
        // If no permissions, return empty result
        return [];
      }
    }

    console.log('Query for getAllCapaworkspaces:', query);

    const results = await CapaworkspaceModel.aggregate([
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
    ]);

    return results;
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

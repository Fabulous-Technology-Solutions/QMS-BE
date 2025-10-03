import ProcessModel from './process.modal';
import {
  createProcess,
  ProcessQuery,
  PaginationOptions,
  PaginatedResponse,
  ProcessModal as IProcessModal,
} from './process.interfaces';
import { IUserDoc } from '@/modules/user/user.interfaces';

const createProcessService = async (processData: createProcess) => {
  const newProcess = new ProcessModel(processData);
  return await newProcess.save();
};

const updateProcessService = async (id: string, processData: Partial<createProcess>, user?: IUserDoc) => {
  const query: ProcessQuery = { _id: id };

  if (user && user.role === 'admin') {
    query.createdBy = user._id;
  } else if (user && user.role === 'sub-admin') {
    query.createdBy = user.createdBy;
  } else {
    throw new Error('Unauthorized');
  }

  return await ProcessModel.findOneAndUpdate(query, processData, { new: true });
};

const deleteProcessService = async (id: string, user?: IUserDoc) => {
  const query: ProcessQuery = { _id: id };

  if (user && user.role === 'admin') {
    query.createdBy = user._id;
  } else if (user && user.role === 'sub-admin') {
    query.createdBy = user.createdBy;
  } else {
    throw new Error('Unauthorized');
  }

  return await ProcessModel.findOneAndDelete(query);
};

const getProcessService = async (id: string) => {
  return await ProcessModel.findById(id);
};

const getAllProcessesService = async (
  options?: PaginationOptions,
  user?: IUserDoc
): Promise<PaginatedResponse<IProcessModal>> => {
  const { page = 1, limit = 10, search = '' } = options || {};
  const query: ProcessQuery = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (user && user.role === 'admin') {
    query.createdBy = user._id;
  } else if (user && user.role === 'sub-admin') {
    query.createdBy = user.createdBy;
  } else {
    throw new Error('Unauthorized');
  }

  const processes = await ProcessModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('parentSite', 'name')
    .populate({
      path: 'modules', 
      populate: {
        path: 'planId', 
        select: 'name price',
      },
      select: '_id',
    });

  const total = await ProcessModel.countDocuments(query);

  return {
    data: processes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getProcessByModuleIdService = async (
  moduleId: string,
  options?: PaginationOptions
): Promise<PaginatedResponse<IProcessModal>> => {
  const { page = 1, limit = 10, search = '' } = options || {};
  const query: ProcessQuery = { modules: { $in: [moduleId] } };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const processes = await ProcessModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('parentSite', 'name')
    .populate('modules', 'name');

  const total = await ProcessModel.countDocuments(query);

  return {
    data: processes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getProcessNamesByModuleService = async (moduleId: string): Promise<Pick<IProcessModal, 'name' | 'subProcesses'>[]> => {
  return await ProcessModel.find({ modules: { $in: [moduleId] } }).select('name subProcesses');
};

const getProcessesBySiteService = async (
  siteId: string,
  options?: PaginationOptions
): Promise<PaginatedResponse<IProcessModal>> => {
  const { page = 1, limit = 10, search = '' } = options || {};
  const query: ProcessQuery = { parentSite: siteId };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const processes = await ProcessModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('parentSite', 'name')
    .populate('modules', 'name');

  const total = await ProcessModel.countDocuments(query);

  return {
    data: processes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export default {
  createProcessService,
  updateProcessService,
  deleteProcessService,
  getProcessService,
  getAllProcessesService,
  getProcessByModuleIdService,
  getProcessNamesByModuleService,
  getProcessesBySiteService,
};

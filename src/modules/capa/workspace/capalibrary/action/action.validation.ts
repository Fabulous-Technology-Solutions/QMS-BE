import { CreateActionRequest } from './action.interfaces';
import Joi from 'joi';

const createActionBody: Record<keyof CreateActionRequest, any> = {
  name: Joi.string().min(3).max(100).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 100 characters long',
  }),
  description: Joi.string().min(10).max(500).messages({
    'string.base': 'Description must be a string',
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description must be at most 500 characters long',
  }),
  createdBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'CreatedBy ID must be a string',
    'string.pattern.base': 'CreatedBy ID must be a valid ObjectId',
  }),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'on-hold').messages({
    'string.base': 'Status must be a string',
  }),
  assignedTo: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'AssignedTo ID must be a string',
    'string.pattern.base': 'AssignedTo ID must be a valid ObjectId',
  })).optional(),
  priority: Joi.string().valid('low', 'medium', 'high'),
  type: Joi.string().valid('preventive', 'corrective'),
  endDate: Joi.date(),
  startDate: Joi.date(),
  library: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'library ID must be a string',
    'string.pattern.base': 'library ID must be a valid ObjectId',
  }),
  docfile: Joi.string().uri().messages({
    'string.base': 'Docfile must be a string',
    'string.uri': 'Docfile must be a valid URI',
  }),
  docfileKey: Joi.string().messages({
    'string.base': 'DocfileKey must be a string',
  }),
  cause: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'Cause ID must be a string',
    'string.pattern.base': 'Cause ID must be a valid ObjectId',
  }),
  workspaceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'Workspace ID must be a string',
    'string.pattern.base': 'Workspace ID must be a valid ObjectId',
  }),
  moduleId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'Module ID must be a string',
    'string.pattern.base': 'Module ID must be a valid ObjectId',
  }),
  libraryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.base': 'Library ID must be a string',
    'string.pattern.base': 'Library ID must be a valid ObjectId',
  }),
  user: Joi.object().optional(),
};

export const createAction = {
  body: Joi.object().keys(createActionBody).fork(['name', 'library', 'startDate', 'type', 'priority'], (schema) => schema.required()),
};

export const updateAction = {
  body: Joi.object().keys(createActionBody),
};

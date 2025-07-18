import {CreateWorkspaceUserRequest} from "./workspaceUser.interfaces";
import Joi from 'joi';

const createbody: Record<keyof CreateWorkspaceUserRequest, any> = {
  workspaceId: Joi.string().messages({
    'string.empty': 'Workspace ID is required',
  }), 
  roleId: Joi.string().messages({
    'string.empty': 'Role ID is required',
  }),
  name: Joi.string().messages({
    'string.empty': 'Name is required',
  }),
  email: Joi.string().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
  }),
  status: Joi.string().valid('active', 'inactive').messages({
    'string.empty': 'Status is required',
    'any.only': 'Status must be either active or inactive',
  }),
  profilePicture: Joi.string().uri().optional().messages({
    'string.uri': 'Profile picture must be a valid URI',
  }),
};                                  

export const createWorkspaceUser = {
  body: Joi.object().keys(createbody).fork(['workspaceId', 'userId', 'roleId', 'name', 'email', 'status'], (schema) => schema.required()),
};
export const updateWorkspaceUser= {
  params: Joi.object().keys(createbody).min(1)
};

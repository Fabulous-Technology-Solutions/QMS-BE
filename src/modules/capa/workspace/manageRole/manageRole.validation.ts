import Joi from 'joi';
import { CreateRoleRequest } from './manageRole.interfaces';

const roleBody:Record<keyof CreateRoleRequest, any> = {
    name: Joi.string().min(2).max(100).messages({
        'string.empty': 'Name is required',
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters'
    }),
    description: Joi.string().min(5).max(500).messages({    
        'string.empty': 'Description is required',
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 5 characters long',
        'string.max': 'Description must not exceed 500 characters'
    }),
    permissions: Joi.valid('view', 'edit', 'admin').messages({
        'any.only': 'Permissions must be one of [view, edit, admin]'
    }),
    workspace: Joi.string().messages({
        'string.empty': 'Workspace is required',
        'string.base': 'Workspace must be a string'
    })
};


export const createRole = {
    body: Joi.object().keys(roleBody).fork(['name', 'description', 'permissions', 'workspace'], (schema) => schema.required()),
};

export const updateRole = {
    body: Joi.object().keys(roleBody).min(1)
};
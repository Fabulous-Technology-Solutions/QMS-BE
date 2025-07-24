import Joi from "joi";
import { CreateGroupRequest } from "./group.interfaces";

const groupBody: Record<keyof CreateGroupRequest, any> = {
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
    workspace: Joi.string().messages({
        'string.empty': 'Workspace is required',
        'string.base': 'Workspace must be a string'
    }), 
    members: Joi.array().items(Joi.string()).messages({
        'array.base': 'Members must be an array of strings',
        'string.base': 'Each member must be a string'
    }),
    status: Joi.string().valid('active', 'inactive').messages({
        'any.only': 'Status must be one of [active, inactive]'
    }),
    createdBy: Joi.string().messages({
        'string.empty': 'CreatedBy is required',
        'string.base': 'CreatedBy must be a string'
    })
};

export const groupValidationSchema = Joi.object().keys(groupBody).fork(['name', 'description', 'workspace',"members","status"], (schema) => schema.required());

export const updateGroupValidationSchema = Joi.object().keys(groupBody).min(1).messages({
  'object.min': 'At least one field must be provided for update'
})
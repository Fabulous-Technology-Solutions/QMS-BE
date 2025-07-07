import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import {  NewCreatedUser } from './user.interfaces';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().optional().email(),
  password: Joi.string().optional().custom(password),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  role: Joi.string().optional().valid('subAdmin', 'admin'),
  contact: Joi.string().optional(),
  googleId: Joi.string().optional(),
  providers: Joi.array().items(Joi.string().valid('google', 'local')).default(['local']),
  permissions: Joi.array().items(Joi.string()).optional(),
  adminOF: Joi.array().items(Joi.string().custom(objectId)).min(1).optional(),
  subAdminRole: Joi.string().valid('subAdmin', 'standardUser').optional(),
  createdBy: Joi.string().custom(objectId).optional(),
  ownerId:Joi.string().custom(objectId).optional()
};

export const createUser = {
  body: Joi.object().keys(createUserBody).fork(['email', 'password', 'firstName', 'lastName', "subAdminRole", "adminOF"], (schema) => schema.required()),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

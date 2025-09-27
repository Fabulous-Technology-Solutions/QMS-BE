import {ConsequenceInput} from './consequence.interfaces';
import Joi from 'joi';

const ConsequenceBody:Record<keyof ConsequenceInput, any> = {
  library: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  createdBy: Joi.string(),
};

export const createConsequenceValidationSchema = { body: Joi.object().keys(ConsequenceBody).fork(['library', 'name', 'description'], (schema) => schema.required()) };
export const updateConsequenceValidationSchema = { body: Joi.object().keys(ConsequenceBody).fork(['library', 'name', 'description'], (schema) => schema.optional()) };
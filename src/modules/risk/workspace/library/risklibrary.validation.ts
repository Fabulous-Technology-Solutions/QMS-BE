import {CreateLibraryRequest} from "./risklibrary.interfaces";
import Joi from "joi";

const libraryBody: Record<keyof CreateLibraryRequest, any> = {
  name: Joi.string().min(2).max(100).messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have a minimum length of {#limit}`,
    "string.max": `"name" should have a maximum length of {#limit}`,
    "any.required": `"name" is a required field`
  }),
  description: Joi.string().min(2).max(500).messages({
    "string.base": `"description" should be a type of 'text'`,
    "string.empty": `"description" cannot be an empty field`,
    "string.min": `"description" should have a minimum length of {#limit}`,
    "string.max": `"description" should have a maximum length of {#limit}`,
    "any.required": `"description" is a required field`
  }),
  site: Joi.string().messages({
    "string.base": `"site" should be a type of 'text'`,
    "string.empty": `"site" cannot be an empty field`,
    "any.required": `"site" is a required field`
  }),
  process: Joi.string().messages({
    "string.base": `"process" should be a type of 'text'`,
    "string.empty": `"process" cannot be an empty field`,
    "any.required": `"process" is a required field`
  }),
  workspace: Joi.string().messages({
    "string.base": `"workspace" should be a type of 'text'`,
    "string.empty": `"workspace" cannot be an empty field`,
    "any.required": `"workspace" is a required field`
  }),
  createdBy: Joi.string().messages({
    "string.base": `"createdBy" should be a type of 'text'`,
    "string.empty": `"createdBy" cannot be an empty field`,
    "any.required": `"createdBy" is a required field`
  }),
  members: Joi.array().items(Joi.string()).optional().messages({
    "array.base": `"members" should be an array of 'text'`,
  }),
  managers: Joi.array().items(Joi.string()).optional().messages({
    "array.base": `"managers" should be an array of 'text'`,
  }),
  status: Joi.string().valid('pending', 'completed', 'in-progress').optional(),
  assessmentApproval: Joi.object({
    status: Joi.string().valid('Reviewed', 'Approved', 'Draft').optional(),
    feedback: Joi.string().allow('', null).optional()
  }).optional(),
  riskappetite: Joi.number().optional(),
  category: Joi.string().allow(null, '').optional(),
  dateIdentified: Joi.string().allow(null, '').optional(),
};

export const libraryValidationSchema = { body: Joi.object().keys(libraryBody).fork(['name', 'description', 'workspace'], (schema) => schema.required()) };

export const updateLibraryValidationSchema = {
  body: Joi.object().keys(libraryBody).min(1).messages({
    "object.min": "At least one field must be provided for update"
  })
};
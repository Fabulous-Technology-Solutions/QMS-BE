import {CreateLibraryRequest} from "./capalibrary.interfaces";
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
  processdata: Joi.object({
    process: Joi.string().messages({
      "string.base": `"process" should be a type of 'text'`,
      "string.empty": `"process" cannot be an empty field`,
      "any.required": `"process" is a required field`
    }),
    subProcess: Joi.array().items(Joi.string()).messages({
      "array.base": `"subProcess" should be an array of 'text'`,
    }).optional()
  }).messages({
    "object.base": `"processdata" should be a type of 'object'`,
    "any.required": `"processdata" is a required field`
  }),
  endDate: Joi.date().allow(null).optional().messages({
    "date.base": `"endDate" should be a valid date`,
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
  status: Joi.string().valid("pending", "completed", "in-progress").messages({
    "string.base": `"status" should be a type of 'text'`,
    "any.required": `"status" is a required field`
  }),
  members: Joi.array().items(Joi.string()).optional().messages({
    "array.base": `"members" should be an array of 'text'`,
  }),
  managers: Joi.array().items(Joi.string()).optional().messages({
    "array.base": `"managers" should be an array of 'text'`,
  }),
  priority: Joi.string().valid("low", "medium", "high").messages({
    "string.base": `"priority" should be a type of 'text'`,
    "any.required": `"priority" is a required field`
  }),
  Form5W2H: Joi.object({
    what: Joi.string().allow(null, '').optional(),
    why: Joi.string().allow(null, '').optional(),
    when: Joi.string().allow(null, '').optional(),
    where: Joi.string().allow(null, '').optional(),
    who: Joi.string().allow(null, '').optional(),
    how: Joi.string().allow(null, '').optional(),
    howImpacted: Joi.string().allow(null, '').optional(),
  }).optional(),
  containment: Joi.object({
    status: Joi.boolean().optional(),
    description: Joi.string().allow(null, '').optional(),
    dueDate: Joi.date().optional(),
  }).optional(),
};

export const libraryValidationSchema = { body: Joi.object().keys(libraryBody).fork(['name', 'description', 'workspace', 'priority'], (schema) => schema.required()) };

export const updateLibraryValidationSchema = {
  body: Joi.object().keys(libraryBody).min(1).messages({
    "object.min": "At least one field must be provided for update"
  })
};
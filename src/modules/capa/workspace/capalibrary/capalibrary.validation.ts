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
  startDate: Joi.date().messages({
    "date.base": `"startDate" should be a type of 'date'`,
    "any.required": `"startDate" is a required field`
  }),
  dueDate: Joi.date().messages({
    "date.base": `"dueDate" should be a type of 'date'`,
    "any.required": `"dueDate" is a required field`
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
};

export const libraryValidationSchema = Joi.object(libraryBody).fork(
  ["name", "description", "startDate", "dueDate", "workspace", "status"],
  (schema) => schema.required()
);

export const updateLibraryValidationSchema = Joi.object(libraryBody).min(1).messages({
  "object.min": "At least one field must be provided for update"
});
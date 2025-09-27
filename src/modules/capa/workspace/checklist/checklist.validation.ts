import {CreateChecklistRequest} from "./checklist.interface"
import Joi from "joi"

const checkListBody: Record<keyof CreateChecklistRequest, Joi.Schema> = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    workspace: Joi.string().required()
};

export const checkListValidationSchema = { body: Joi.object().keys(checkListBody).fork(['name', 'description', 'workspace'], (schema) => schema.required()) };

export const checkListUpdateValidationSchema = { body: Joi.object().keys(checkListBody).min(1) };
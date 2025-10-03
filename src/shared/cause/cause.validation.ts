import Joi from "joi";
import { CreateCausesRequest } from "./cause.interfaces";

const causesBody: Record<keyof CreateCausesRequest, Joi.Schema> = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    library: Joi.string().required(),
    fileUrl: Joi.string().uri().optional(),
    fileKey: Joi.string().optional()
};

export const createCausesSchema = Joi.object().keys(causesBody).fork(['name', 'description', 'library'], (schema) => schema.required())

export const updateCausesSchema = Joi.object().keys(causesBody).min(1).messages({
    "object.min": "At least one field must be provided for update"
});
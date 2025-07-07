import Joi from 'joi';
import { CreateCapaworkspaceRequest } from "./workspace.interfaces";
const capaworkspaceBody: Record<keyof CreateCapaworkspaceRequest, any> = {
    moduleId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).optional(),
    name: Joi.string().min(2).max(100).optional(),
    imageUrl: Joi.string().uri().optional(),
    imagekey: Joi.string().optional(),
    description: Joi.string().optional(),
}

export const createCapa = {
    body: Joi.object().keys(capaworkspaceBody).fork(['moduleId',"name","imageUrl","imagekey","description"], (schema) => schema.required()),
};

export const updateCapa = {
    body: Joi.object().keys(capaworkspaceBody).min(1),
};


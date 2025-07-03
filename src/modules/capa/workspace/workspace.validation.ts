import Joi from 'joi';
import { CreateCapaworkspaceRequest } from "./workspace.interfaces";
const capaworkspaceBody: Record<keyof CreateCapaworkspaceRequest, any> = {
    moduleId: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).required(),
    name: Joi.string().required(),
    imageUrl: Joi.string().uri().required(),
    imagekey: Joi.string().required(),
    description: Joi.string().required(),
}

export const createCapa = {
    body: Joi.object().keys(capaworkspaceBody),
};
import {createIshikawaRequest} from "./Ishikawa.interfaces"
import Joi from "joi";

const IshikawaBody:Record<keyof createIshikawaRequest,Joi.Schema> = {
    library: Joi.string().required(),
    createdBy: Joi.string().required(),
    problems: Joi.array().items(Joi.object({
        problem: Joi.string().required(),
        category: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            cause: Joi.array().items(Joi.string()).required()
        })).required()
    })).required()
};

export const CreateIshikawaSchema = Joi.object().keys(IshikawaBody);

import {createProcess} from "./process.interfaces";
import Joi from "joi";


const processBody: Record<keyof createProcess, Joi.Schema> = {
  name: Joi.string().max(100),
  location: Joi.string().max(100),
  parentSite: Joi.string(),
  processCode: Joi.string().max(100),
  note: Joi.string().max(500),
  createdBy: Joi.string(),
  modules: Joi.array().items(Joi.string()).optional(),
  status: Joi.boolean().optional(),
  acrossMultipleSites: Joi.boolean().optional(),
};

export const createProcessSchema = Joi.object().keys(processBody).fork(["name","location","parentSite","note"], (schema) => schema.required());

export const updateProcessSchema = Joi.object().keys(processBody).min(1);


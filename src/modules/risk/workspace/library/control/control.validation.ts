import { CreateControl } from "./control.interfaces";
import Joi from "joi";

const createControlBody:Record<keyof CreateControl, Joi.Schema> = {
  library: Joi.string(),
  description: Joi.string(),
  controlType: Joi.string(),
  effectiveness: Joi.string(),
  owners: Joi.array().items(Joi.string().required()),
  name: Joi.string()
};
export const createControlSchema = { body: Joi.object().keys(createControlBody).fork(['library', 'name','description','effectiveness','owners'], (schema) => schema.required()) };

export const updateControlSchema = { body: Joi.object().keys(createControlBody) };
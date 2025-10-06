import {createSite} from "./site.interfaces";
import Joi from "joi";

const SiteBody: Record<keyof createSite, Joi.Schema> = {
  name: Joi.string().max(100).required(),
  location: Joi.string().max(100).required(),
  timeZone: Joi.string().max(100).required(),
  note: Joi.string().max(500).required(),
  createdBy: Joi.string(),
  modules: Joi.array().items(Joi.string()).optional(),
  status: Joi.boolean().optional(),
};

export const createSiteSchema = Joi.object().keys(SiteBody).fork(["name","location","timeZone","note"], (schema) => schema.required());
export const updateSiteSchema = Joi.object().keys(SiteBody).min(1);


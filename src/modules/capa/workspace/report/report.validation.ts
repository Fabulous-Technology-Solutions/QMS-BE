import Joi from 'joi';
import {ICreateReport } from './report.interfaces';

const reportSchemaBody:Record<keyof ICreateReport, Joi.Schema> = {
  name: Joi.string().required(), 
  schedule: Joi.boolean(),
  scheduleFrequency: Joi.string().valid('daily', 'weekly', 'monthly'),
  assignUsers: Joi.array().items(Joi.string()),
  site: Joi.string(),
  process: Joi.string(),
  status: Joi.string(),
  createdBy: Joi.string(),
  workspace: Joi.string(),
  isDeleted: Joi.boolean().default(false)
};


export const createReportSchema = Joi.object().keys(reportSchemaBody).fork(['name', 'workspace'], (schema) => schema.required());

export const updateReportSchema = Joi.object().keys(reportSchemaBody).min(1);
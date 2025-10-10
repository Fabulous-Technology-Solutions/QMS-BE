import Joi from 'joi';
import {ICreateReport } from './report.interfaces';

const reportSchemaBody:Record<keyof ICreateReport, Joi.Schema> = {
  name: Joi.string().required(), 
  schedule: Joi.boolean(),
  scheduleFrequency: Joi.string().valid('daily', 'weekly', 'monthly'),
  assignUsers: Joi.array().items(Joi.string()),
  sites: Joi.array().items(Joi.string().length(24)),
  processes: Joi.array().items(Joi.string().length(24)),
  statuses: Joi.array().items(Joi.string().length(24)),
  createdBy: Joi.string(),
  workspace: Joi.string(),
  isDeleted: Joi.boolean().default(false)
};


export const createReportSchema = Joi.object().keys(reportSchemaBody).fork(['name', 'workspace'], (schema) => schema.required());

export const updateReportSchema = Joi.object().keys(reportSchemaBody).min(1);
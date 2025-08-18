import Joi from 'joi';
import {ICreateReport } from './report.interfaces';

const reportSchemaBody:Record<keyof ICreateReport, Joi.Schema> = {
  name: Joi.string().required(), 
  schedule: Joi.boolean(),
  scheduleFrequency: Joi.string().valid('daily', 'weekly', 'monthly'),
  scheduleEmails: Joi.array().items(Joi.string().email()),
  createdBy: Joi.string(),
  workspace: Joi.string(),
  isDeleted: Joi.boolean().default(false),
  library: Joi.string().required()
};


export const createReportSchema = Joi.object().keys(reportSchemaBody).fork(['name', 'workspace', 'library'], (schema) => schema.required());

export const updateReportSchema = Joi.object().keys(reportSchemaBody).min(1);
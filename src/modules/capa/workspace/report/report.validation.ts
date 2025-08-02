import Joi from 'joi';
import {ICreateReport } from './report.interfaces';

const reportSchemaBody:Record<keyof ICreateReport, Joi.Schema> = {
  name: Joi.string().required(),
  type: Joi.string().valid('summary', 'effectiveness', 'department',"closure","overdue"),
  format: Joi.string().valid('pdf', 'both', 'xlsx'),
  schedule: Joi.boolean(),
  scheduleFrequency: Joi.string().valid('daily', 'weekly', 'monthly'),
  scheduleEmails: Joi.array().items(Joi.string().email()),
  startDate: Joi.date().iso(),
  endDate: Joi.date(),
  site: Joi.string(),
  department: Joi.string(),
  docfile: Joi.string(),
  dockey: Joi.string(),
  createdBy: Joi.string(),
  workspace: Joi.string(),
  isDeleted: Joi.boolean().default(false)
};


export const createReportSchema = Joi.object().keys(reportSchemaBody).fork(['startDate',"name","type","format","workspace"], (schema) => schema.required());

export const updateReportSchema = Joi.object().keys(reportSchemaBody).min(1);
import { createChecklistHistory } from './checklisthistory.interfaces';
import Joi from 'joi';

const historyBody: Record<keyof createChecklistHistory, Joi.Schema> = {
  checklistId: Joi.string().required(),
  library: Joi.string().required(),
  comment: Joi.string().required(),
  createdBy: Joi.string(),
  list: Joi.array()
    .items(
      Joi.object({
        item: Joi.string().required(),
        yes: Joi.boolean().required(),
        no: Joi.boolean().required(),
        partial: Joi.boolean().required(),
        evidence: Joi.string().uri(),
        evidenceKey: Joi.string(),
        comment: Joi.string().min(2).max(100),
      })
    )
    .required(),
};  

export const createChecklistHistoryValidation = { body: Joi.object()
  .keys(historyBody)
  .fork(['checklistId', 'library', 'list'], (field) => field.required())};

export const updateChecklistHistoryValidation = { body: Joi.object().keys(historyBody).min(1) };

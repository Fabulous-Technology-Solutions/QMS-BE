import {createChecklistHistory} from  "./checklisthistory.interfaces";
import Joi from "joi";

const historyBody:Record<keyof createChecklistHistory,Joi.Schema> = {
  checklistId: Joi.string().required(),
  library: Joi.string().required(),
  comment: Joi.string().required(),
  createdBy: Joi.string().required(),
  list: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      yes: Joi.boolean().required(),
      no: Joi.boolean().required(),
      partial: Joi.boolean().required()
    })
  ).required()
};


export const createChecklistHistoryValidation = Joi.object().keys(historyBody).fork([
  "checklistId", "library", "comment", "list"
], (field) => field.required());



export const updateChecklistHistoryValidation = Joi.object().keys(historyBody).min(1)
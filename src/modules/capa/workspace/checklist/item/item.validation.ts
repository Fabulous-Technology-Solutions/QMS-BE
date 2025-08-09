import { CreateCheckListItemRequest } from './item.interface';
import Joi from 'joi';

const checklistitemBody: Record<keyof CreateCheckListItemRequest, Joi.Schema> = {
  question: Joi.string().min(2).max(100),
  checklist: Joi.string().length(24),

};

export const CreateItem = Joi.object()
  .keys({
    ...checklistitemBody,
  })
  .fork(['checklist', 'question'], (schema) =>
    schema.required().messages({
      'any.required': 'This field is required',
    })
  );
export const CreateItemsArraySchema = Joi.array().items(CreateItem).min(1).messages({
  'array.min': 'At least one checklist item must be provided',
  'array.base': 'Checklist items must be an array',
});

export const UpdateItem = Joi.object()
  .keys({
    ...checklistitemBody,
  })
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const UpdateItemsArraySchema = Joi.array().items(UpdateItem).min(1).messages({
  'array.min': 'At least one checklist item must be provided for update',
  'array.base': 'Checklist items must be an array',
});

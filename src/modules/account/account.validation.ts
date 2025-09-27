import Joi from 'joi';
import { Iaccount } from './account.interfaces';

const accountBodySchema: Record<keyof Iaccount, Joi.Schema> = {
  role: Joi.string().valid('admin', 'workspaceUser', 'standardUser').required(),
  workspaceRole: Joi.string().valid('admin', 'view', 'edit').optional(),
  Permissions: Joi.array()
     .items(
       Joi.object({
         permission: Joi.string().required(),
         workspace: Joi.string().required(),
       })
     )
     .optional(),
  accountId: Joi.string(),
  user: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
};

export const updateAccountValidationSchema = { body: Joi.object().keys(accountBodySchema).min(1) };

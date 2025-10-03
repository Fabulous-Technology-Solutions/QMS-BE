import { Invitation } from './invitation.interfces';
import Joi from 'joi';

const invitationBodySchema: Record<keyof Invitation, Joi.Schema> = {
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'workspaceUser', 'standardUser').required(),
  Permissions: Joi.array()
    .items(
      Joi.object({
        permission: Joi.string().default('view').valid('admin', 'view', 'edit'),
        workspace: Joi.string().required(),
      })
    )
    .optional(),
  status: Joi.string().valid('pending', 'accepted').default('pending'),
  token: Joi.string(),
  invitedBy: Joi.string(),
  accountId: Joi.string().optional(),
};

export const invitationValidationSchema = { body: Joi.object()
  .keys(invitationBodySchema)
  .fork(['email', 'role','accountId'], (schema) => schema.required())};

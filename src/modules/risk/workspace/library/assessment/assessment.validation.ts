import { CreateAssessmentRequest } from './assessment.interfaces';
import Joi from 'joi';

const createAssessmentBody: Record<keyof CreateAssessmentRequest, any> = {
    name: Joi.string().min(3).max(100).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 100 characters long',
    }),
    library: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.base': 'Library ID must be a string',
            'string.pattern.base': 'Library ID must be a valid ObjectId',
        }),
    createdBy: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.base': 'CreatedBy ID must be a string',
            'string.pattern.base': 'CreatedBy ID must be a valid ObjectId',
        }),
    evaluator: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.base': 'Evaluator ID must be a string',
            'string.pattern.base': 'Evaluator ID must be a valid ObjectId',
        }),
    template: Joi.string().uri().messages({
        'string.base': 'Template must be a string',
        'string.uri': 'Template must be a valid URI',
    }),
    templateKey: Joi.string().messages({
        'string.base': 'TemplateKey must be a string',
    }),

    probability: Joi.number().min(1).max(5).messages({
        'number.base': 'Probability must be a number',
        'number.min': 'Probability must be at least 1',
        'number.max': 'Probability must be at most 5',
    }),
    impact: Joi.number().min(1).max(5).messages({
        'number.base': 'Impact must be a number',
        'number.min': 'Impact must be at least 1',
        'number.max': 'Impact must be at most 5',
    }),
    status: Joi.string().valid('draft', 'reviewed', 'approved', 'rejected', 'pending').messages({
        'string.base': 'Status must be a string',
    }),
    approval: Joi.boolean().messages({
        'boolean.base': 'Approval must be a boolean',
    }),
};


const createAssessmentSchema = { body: Joi.object().keys(createAssessmentBody).fork(
    ['name', 'library',  'evaluator','probability', 'impact'],
    (schema) => schema.required()
)};

const updateAssessmentSchema = { body: Joi.object().keys(createAssessmentBody) };
export {
    createAssessmentSchema,
    updateAssessmentSchema
}

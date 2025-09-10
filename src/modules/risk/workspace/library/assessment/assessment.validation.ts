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
    severity: Joi.string().valid('low', 'medium', 'high', 'low-medium', 'high-medium').messages({
        'string.base': 'Severity must be a string',
    }),
    probability: Joi.string().valid('high-unlikely', 'low-unlikely', 'likely', 'possible', 'high-likely').messages({
        'string.base': 'Probability must be a string',
    }),
    impact: Joi.string().valid('not-significant', 'minor', 'moderate', 'major', 'severe').messages({
        'string.base': 'Impact must be a string',
    }),
    status: Joi.string().valid('draft', 'reviewed', 'approved', 'rejected', 'pending').messages({
        'string.base': 'Status must be a string',
    }),
    approval: Joi.boolean().messages({
        'boolean.base': 'Approval must be a boolean',
    }),
};


const createAssessmentSchema = Joi.object().keys(createAssessmentBody).fork(
    ['name', 'library', 'createdBy', 'evaluator', 'template', 'templateKey', 'severity', 'probability', 'impact'],
    (schema) => schema.required()
);

const updateAssessmentSchema = Joi.object().keys(createAssessmentBody);
export {
    createAssessmentSchema,
    updateAssessmentSchema
}

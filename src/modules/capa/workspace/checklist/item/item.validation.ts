
import {CreateCheckListItemRequest} from "./item.interface"
import Joi
 from "joi";

const checklistitemBody:Record<keyof CreateCheckListItemRequest, Joi.Schema> = {
    question: Joi.string().min(2).max(100).required(),
    checklist: Joi.string().length(24).required(),
    evidence: Joi.string().uri().required(),
    evidenceKey: Joi.string().required(),
    comment: Joi.string().min(2).max(100).required(),
};


export const CreateItem = Joi.object().keys({
    ...checklistitemBody,   
}).fork(["checklist", "evidenceKey","question","comment","evidence"], (schema) => 
    schema.required().messages({
        "any.required": "This field is required"
    })
);

export const UpdateItem = Joi.object().keys({
    ...checklistitemBody,
}).min(1).messages({
    "object.min": "At least one field must be provided for update"
});

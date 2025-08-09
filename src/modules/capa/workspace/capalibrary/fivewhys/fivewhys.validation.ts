import {CreateFiveWhysRequest} from "./fivewhys.interfaces";
import Joi from "joi";

const FiveWhyBody:Record<keyof CreateFiveWhysRequest, Joi.Schema> = {
  library: Joi.string().length(24),
  problem: Joi.string().max(500),
  list: Joi.array().items(
    Joi.object({
      question: Joi.string().max(200).required().messages({
        "string.base": `"question" should be a type of 'text'`,
      }),
      answer: Joi.string().max(500).required().messages({
        "string.base": `"answer" should be a type of 'text'`,
      }),
    })
  ).min(1).max(5).messages({
    "array.min": "At least one question-answer pair is required",
    "array.max": "A maximum of five question-answer pairs are allowed",
  })
};

export const CreateFiveWhysRequestSchema = Joi.object().keys(FiveWhyBody).fork(['library', 'problem', 'list'], (schema) => schema.required())
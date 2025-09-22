import {ICreateChat} from "./chat.interfaces";  
import Joi from "joi";

const createChatBody: Record<keyof ICreateChat, Joi.Schema> = {
  obj: Joi.string().optional().allow(null, ''),
  chatOf: Joi.string().required(),
};

export const createChat = Joi.object().keys(createChatBody);
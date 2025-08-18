
import Joi from 'joi';

const IshikawaBody = {
  library: Joi.string().required(),
  createdBy: Joi.string(),
  problems: Joi.array()
    .items(
      Joi.object({
        problem: Joi.string().required(),
        category: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              cause: Joi.array()
                .items(
                  Joi.object({
                    name: Joi.string().required(),
                    subCauses: Joi.array().items(Joi.string()),
                  })
                )
                .required(),
            })
          )
          .required(),
      })
    )
    .required(),
};

export const CreateIshikawaSchema = Joi.object().keys(IshikawaBody);

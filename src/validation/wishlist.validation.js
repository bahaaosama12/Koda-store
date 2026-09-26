import Joi from "joi";

const productIdValidation = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid product id",
      "any.required": "product id is required",
      "string.empty": "product id cannot be empty",
    }),
});


export { productIdValidation };
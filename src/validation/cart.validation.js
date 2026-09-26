import Joi from "joi";

const addItemToCartValidation = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid product id",
      "any.required": "product id is required",
    }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Quantity must be at least 1",
  }),
});


const updateItemQuantityValidation = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid product id",
      "any.required": "product id is required",
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.min": "quantity must be at least 1",
    "any.required": "quantity is required",
  }),
});

const applyCouponValidation = Joi.object({
  code: Joi.string()
    .uppercase()
    .trim()
    .valid("SAVE10", "SAVE20", "SAVE50", "SAVE80", "OFF50")
    .required()
    .messages({
      "any.only":
        "invalid coupon code. available codes only: SAVE10, SAVE20, SAVE50, SAVE80, OFF50",
      "any.required": "coupon code is required",
      "string.empty": "coupon code cannot be empty",
    }),
});

export{
  addItemToCartValidation,
  updateItemQuantityValidation,
  applyCouponValidation
}
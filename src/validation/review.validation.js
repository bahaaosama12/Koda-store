import Joi from "joi";

const productId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid product id",
      "any.required": "product id is required",
      "string.empty": "product id cannot be empty",
    })

const getProductReviewsValidation = Joi.object({
  productId: productId,
});

const addReviewValidationBody = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "rating must be a number",
    "number.integer": "rating must be an integer",
    "number.min": "rating must be at least 1",
    "number.max": "rating cannot exceed 5",
    "any.required": "rating is required",
  }),
  comment: Joi.string().min(3).max(500).trim().required().messages({
    "string.base": "comment must be a string",
    "string.min": "comment must be at least 3 characters",
    "string.max": "comment cannot exceed 500 characters",
    "string.empty": "comment cannot be empty",
    "any.required": "comment is required",
  }),
});

const addReviewValidationParam = Joi.object({
  productId: productId,
});

const reviewIdValidation = Joi.object({
  productId: productId,
  reviewId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid review id",
      "any.required": "review id is required",
      "string.empty": "review id cannot be empty",
    }),
});

export { getProductReviewsValidation, addReviewValidationBody,addReviewValidationParam, reviewIdValidation };

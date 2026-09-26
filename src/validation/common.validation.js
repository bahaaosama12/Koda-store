import Joi from "joi";

const usernameValidation = Joi.string()
  .min(3)
  .max(20)
  .pattern(/^[a-zA-Z0-9_]+$/)
  .required()
  .trim()
  .lowercase()
  .messages({
    "string.min": "username must be at least 3 characters",
    "string.max": "username cannot exceed 20 characters",
    "string.pattern.base":
      "username can only contain letters, numbers, and underscores",
    "any.required": "username is required",
    "string.empty": "username cannot be empty",
  });

const emailValidation = Joi.string()
  .email()
  .required()
  .trim()
  .lowercase()
  .messages({
    "string.email": "please enter a valid email address",
    "any.required": "email is required",
    "string.empty": "email cannot be empty",
  });

const passwordValidation = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
  .required()
  .messages({
    "string.min": "password must be at least 8 characters",
    "string.pattern.base":
      "password must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)",
    "any.required": "password is required",
    "string.empty": "password cannot be empty",
  });

const phoneValidation = Joi.string()
  .pattern(/^(\+[0-9]{1,3})?[0-9]{7,15}$/)
  .optional()
  .messages({
    "string.pattern.base":
      "please enter a valid phone number with country code (e.g., +201012345678)",
  });


export {
  usernameValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  
};
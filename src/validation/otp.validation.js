import Joi from "joi";
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
} from "./common.validation.js";

const sendOTPRegisterValidation = Joi.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  phone: phoneValidation,
});

const verifyOTPRegisterValidation = Joi.object({
  email: emailValidation,
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
});

const sendOTPForgetPassValidation = Joi.object({
  email: emailValidation,
});

const verifyOTPForgetPassValidation = Joi.object({
  email: emailValidation,
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
  newPassword: passwordValidation,
});

export {
  sendOTPRegisterValidation,
  verifyOTPRegisterValidation,
  sendOTPForgetPassValidation,
  verifyOTPForgetPassValidation,
};

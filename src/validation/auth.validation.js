import Joi from "joi";
import {
  emailValidation,
  passwordValidation,
} from "./common.validation.js";

const loginValidation = Joi.object({
  email: emailValidation,
  password: passwordValidation,
});

export { loginValidation };

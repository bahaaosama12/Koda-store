import Joi from "joi";
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
} from "./common.validation.js";

const adminAddUserSchema = Joi.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  phone: phoneValidation,
});

const updateUserSchema = Joi.object({
  username: usernameValidation.optional(),
  phone: phoneValidation.optional(),
  avatar: Joi.string().uri().optional().messages({
    "string.uri": "avatar must be a valid URL",
  }),
}).min(1);



export { adminAddUserSchema, updateUserSchema };

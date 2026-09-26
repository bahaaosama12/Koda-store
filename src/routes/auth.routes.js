import express from "express";
import { authentication} from "../middleware/auth.middleware.js";
import {validate} from "../middleware/validationMiddleware.js"
import {
  sendOTPRegisterValidation,
  verifyOTPRegisterValidation,
  sendOTPForgetPassValidation,
  verifyOTPForgetPassValidation,
} from "../validation/otp.validation.js";
import { loginValidation } from "../validation/auth.validation.js";
import {
  register,
  login,
  logout,
  profile,
  sendOTPForgetPassword,
  verifyOTPForgetPassword,
  verifyRegisterOTP,
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.route("/register/send-otp").post(validate(sendOTPRegisterValidation), register);
authRouter.route("/verify-otp").post(validate(verifyOTPRegisterValidation), verifyRegisterOTP);
authRouter.post("/forgot-password/send-otp",validate(sendOTPForgetPassValidation), sendOTPForgetPassword);
authRouter.post("/forgot-password/verify-otp", validate(verifyOTPForgetPassValidation), verifyOTPForgetPassword);
authRouter.route("/login").post(validate(loginValidation), login);

authRouter.use(authentication);

authRouter.route("/logout").post(logout);
authRouter.route("/me").get(profile);

export default authRouter;

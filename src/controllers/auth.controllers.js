import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import OTP from "../models/OTP.model.js";
import { sendEmail, formatDate } from "../utils/email.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: `you must send all fields are required`,
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: `Email is already exists`,
      });
    }

    const userData = { username, email, password, phone };

    const otpCodeDoc = await OTP.createOTP(email, userData);
    const OTPuser = new OTP(otpCodeDoc);
    if (OTPuser.isValid()) {
      const { success } = await sendEmail(
        email,
        "Verify Your Email Address",
        "sendOTP-template.hbs",
        {
          name: username,
          otpCode: otpCodeDoc.otp,
          otpExpiry: 5,
        },
      );
      if (success) {
        await OTPuser.save();
        return res.status(200).json({
          success: true,
          message: `send OTP to your ${email} `,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: `failed in send OTP to your ${email} `,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `otp is expired`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `error in send OTP ${error.message}`,
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: `you must send all fields are required`,
      });

    let user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({
        success: false,
        message: `Email or Password is not correct`,
      });

    let userPasswrod = await bcryptjs.compare(password, user.password);
    if (!userPasswrod)
      return res.status(404).json({
        success: false,
        message: `Email or Password is not correct`,
      });

    let token = jwt.sign(
      { _id: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `error during logout: ${error.message} `,
    });
  }
};

const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDocument = await OTP.findOne({ email });

    if (!otpDocument) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (!otpDocument.isValid()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const isCorrect = await otpDocument.compareOTP(otp);

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const { username, password, phone } = otpDocument.userData;

    const newUser = new User({
      username,
      email,
      password,
      phone,
      isVerified: true,
    });

    await newUser.save();

    await OTP.deleteOne({ _id: otpDocument._id });

    return res.status(201).json({
      success: true,
      message: "Email verified and user created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error verifying OTP: ${error.message}`,
    });
  }
};

const sendOTPForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    await OTP.deleteMany({ email: normalizedEmail });

    const otpDocument = await OTP.createOTP(
      normalizedEmail,
      { userId: user._id.toString() },
      5,
    );

    const otp = otpDocument.otp;

    const emailResult = await sendEmail(
      normalizedEmail,
      "Password Recovery OTP",
      "resetPassword-template.hbs",
      {
        name: user.username,
        otpCode: otp,
        otpExpiry: 5,
        subject: "Password Recovery OTP",
      },
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send password recovery email",
      });
    } else {
      await otpDocument.save();
      return res.status(200).json({
        success: true,
        message: "Password recovery OTP sent successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while sending password recovery OTP: ${error.message}`,
    });
  }
};

const verifyOTPForgetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const otpDocument = await OTP.findOne({ email: normalizedEmail }).sort({
      createdAt: -1,
    });

    if (!otpDocument) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (!otpDocument.isValid()) {
      await OTP.deleteOne({ _id: otpDocument._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const isOTPValid = await otpDocument.compareOTP(otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ _id: otpDocument._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while resetting password: ${error.message}`,
    });
  }
};

export {
  login,
  register,
  profile,
  logout,
  sendOTPForgetPassword,
  verifyOTPForgetPassword,
  verifyRegisterOTP,
};

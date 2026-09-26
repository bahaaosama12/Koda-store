import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const authentication = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({
      success: false,
      message: "You must login first. No token provided.",
    });

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "invalid token format. Use 'Bearer <token>'",
    });
  }
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You must login first. No token provided.",
    });
  }
  try {
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: payload._id });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `id user ${payload._id} not found in database`,
      });
    }
    req.user = user;
    req.role = payload.role;
    req._id = payload._id;
    next();
  } catch (error) {
    let message;
    if (error.name === "JsonWebTokenError") {
      message = "invalid token. please login again.";
    } else if (error.name === "TokenExpiredError") {
      message = "token expired. please login again.";
    } else {
      message = "You're not authenticated";
    }
    res.status(401).json({
      success: false,
      message,
    });
  }
};

const restrictTo = (...roles) => {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "you must login first.",
      });
    }
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "you're not authorized to access this resource.",
      });
    }
    next();
  };
};

export { authentication, restrictTo };

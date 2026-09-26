import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import validator from "validator";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error(`${val} is not a valid email`);
        }
      },
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


OTPSchema.statics.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


OTPSchema.statics.createOTP = async function (
  email,
  userData,
  expiryMinutes = 5,
) {
  await this.deleteMany({ email });
  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  const otpDocument = new this({
    email,
    otp,
    expiresAt,
    userData,
  });
  return otpDocument;
};

OTPSchema.methods.isValid = function () {
  return this.expiresAt > new Date();
};


OTPSchema.methods.compareOTP = async function (OTPUser) {
  try {
    return await bcryptjs.compare(OTPUser, this.otp);
  } catch (error) {
    throw new Error(`error comparing OTP: ${error.message}`);
  }
};


OTPSchema.pre("save", async function () {
  if (!this.isModified("otp")) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.otp = await bcryptjs.hash(this.otp, salt);
  } catch (error) {
    throw new Error(`error hashing OTP: ${error.message}`);
  }
});

const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;

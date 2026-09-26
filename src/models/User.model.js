import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const addressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://www.google.com/imgres?q=avatar%20image&imgurl=https%3A%2F%2Fimg.magnific.com%2Fpremium-vector%2Fman-professional-business-casual-young-avatar-icon-illustration_1277826-623.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.magnific.com%2Fvectors%2Favatar&docid=IJAD9wOcoNSBLM&tbnid=_RyeC_EAACWTMM&vet=12ahUKEwiWlr23ytOWAxWwQvEDHdFmB58QnPAOegQIPBAA..i&w=740&h=740&hcb=2&ved=2ahUKEwiWlr23ytOWAxWwQvEDHdFmB58QnPAOegQIPBAA",
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    addresses:{
      type:[addressSchema],
       default:[]
    }, 
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

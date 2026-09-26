import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product reference is required"],
    },
    name: {
      type: String,
      maxlength: [200, "product name can't exceed 200 charcters"],
      required: [true, "product name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "product image is required"],
      trim: true,
    },
    price: {
      type: Number,
      min: [0, "product price can't is nagitive"],
      default: 0,
      required: [true, "product price is required"],
    },
    quantity: {
      type: Number,
      min: [1, "product quaintity must be at least 1"],
      default: 1,
    },
  },
  {
    _id: true,
    timestamps: false,
  },
);

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      uppercase: true,
      trim: true,
      enum: ['SAVE10', 'SAVE20', 'SAVE50', 'SAVE80', 'OFF50'],
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    discountValue: {
      type: Number,
      min: [0, "discount value cannot be negative"],
      validate: {
        validator: function (value) {
          if (this.discountType === "percentage" && value > 100) {
            return false;
          }
          return true;
        },
        message: "percentage discount cannot exceed 100%",
      },
    },
  },
  {
    _id: false,
  },
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
      validate: {
        validator: function (items) {
          const productIds = items.map((item) => item.product.toString());
          return productIds.length === new Set(productIds).size;
        },
        message: "duplicate products are not allowed in the cart",
      },
    },
    coupon: {
      type: CouponSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);


CartSchema.virtual("subtotal").get(function () {
  if (!this.items || this.items.length === 0) return 0;

  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});


CartSchema.virtual("discountAmount").get(function () {
  if (!this.coupon || !this.coupon.code) return 0;

  const subtotal = this.subtotal;
  const { discountType, discountValue } = this.coupon;

  if (discountType === "percentage") {
    return (subtotal * discountValue) / 100;
  } else if (discountType === "fixed") {
    return Math.min(discountValue, subtotal); 
  } else {
    return 0;
  }
});


CartSchema.virtual("itemCount").get(function () {
  if (!this.items || this.items.length === 0) return 0;

  return this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
});


CartSchema.virtual("total").get(function () {
  const subtotal = this.subtotal;
  const discount = this.discountAmount;

  return Math.max(0, subtotal - discount);
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;

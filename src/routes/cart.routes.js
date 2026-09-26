import express from "express";
import { authentication } from "../middleware/auth.middleware.js";
import {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  applyCoupon,
  removeCoupon,
  clearCart
} from "../controllers/cart.controllers.js";
import {
  addItemToCartValidation,
  updateItemQuantityValidation,
  applyCouponValidation
} from "../validation/cart.validation.js";
import { validate } from "../middleware/validationMiddleware.js";

const cartRouter = express.Router();

cartRouter.use(authentication);

cartRouter.route("/").get(getOrCreateCart);

cartRouter.route("/items").post(validate(addItemToCartValidation), addItemToCart);

cartRouter.route("/items").patch(validate(updateItemQuantityValidation), updateCartItemQuantity);

cartRouter.route("/items/:productId").delete(removeItemFromCart);

cartRouter.route("/coupon").post(validate(applyCouponValidation),applyCoupon);

cartRouter.route("/coupon").delete(removeCoupon);

cartRouter.route("/clear").delete(clearCart);

export default cartRouter;

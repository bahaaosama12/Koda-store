import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controllers.js";
import { authentication} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { productIdValidation } from "../validation/wishlist.validation.js";

const wishlistRouter = express.Router();

wishlistRouter.use(authentication)

wishlistRouter.get("/my",getWishlist);

wishlistRouter.post("/add/:productId",validate(productIdValidation, "params"),addToWishlist );

wishlistRouter.delete("/remove/:productId", validate(productIdValidation, "params"),removeFromWishlist);

wishlistRouter.delete("/clear", clearWishlist);

export default wishlistRouter;

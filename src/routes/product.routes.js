import express from "express";
import {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";

import { validate } from "../middleware/validationMiddleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/product.validation.js";
import { uploadMultipleImage } from "../middleware/upload.js";
import { authentication, restrictTo } from "../middleware/auth.middleware.js";
import {
  addReview,
  getReview,
  deleteReview,
} from "../controllers/review.controllers.js";
import {
  getProductReviewsValidation,
  addReviewValidationBody,
  addReviewValidationParam,
  reviewIdValidation,
} from "../validation/review.validation.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/:id", getProductById);
productRouter.get(
  "/:productId/reviews",
  validate(getProductReviewsValidation, "params"),
  getReview,
);

productRouter.use(authentication);

productRouter.post(
  "/:productId/reviews",
  validate(addReviewValidationParam, "params"),
  validate(addReviewValidationBody),
  addReview,
);

productRouter.delete(
  "/:productId/reviews/:reviewId",
  validate(reviewIdValidation, "params"),
  deleteReview,
);

productRouter.use(restrictTo("admin"));

productRouter.post(
  "/",
  uploadMultipleImage,
  validate(createProductSchema),
  createProduct,
);

productRouter.put(
  "/update/:id",
  uploadMultipleImage,
  validate(updateProductSchema),
  updateProduct,
);
productRouter.delete("/:id", deleteProduct);

export default productRouter;

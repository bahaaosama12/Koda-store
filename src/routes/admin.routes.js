import express from "express";
import {
  getDashboardStats,
  getActiveCarts,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getAllWishlists,
  getWishlistStats,
} from "../controllers/admin.controllers.js";
import { authentication, restrictTo } from "../middleware/auth.middleware.js";
import {updateOrderStatusValidation} from "../validation/order.validation.js"
import { validate } from "../middleware/validationMiddleware.js";
const adminRouter = express.Router();

adminRouter.use(authentication);
adminRouter.use(restrictTo("admin"));

adminRouter.get("/dashboard", getDashboardStats);

adminRouter.get("/carts", getActiveCarts);

adminRouter.get("/", getAllOrders);

adminRouter.get("/wishlists", getAllWishlists);

adminRouter.get("/wishlists/stats", getWishlistStats);

adminRouter.get("/:id", getSingleOrder);

adminRouter.patch("/:id/status",validate(updateOrderStatusValidation), updateOrderStatus);

export default adminRouter;

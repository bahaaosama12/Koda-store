import express from "express";
import { authentication, restrictTo } from "../middleware/auth.middleware.js";
import {
  adminAddUser,
  adminGetAllUsers,
  adminGetUserById,
  adminDeleteUser,
} from "../controllers/user.controllers.js";
import { updateProfile } from "../controllers/user.controllers.js";
import { validate } from "../middleware/validationMiddleware.js";

import {
  adminAddUserSchema,
  updateUserSchema,
} from "../validation/user.validation.js";

const userRouter = express.Router();

userRouter.use(authentication);

userRouter.post(
  "/add",
  restrictTo("admin"),
  validate(adminAddUserSchema),
  adminAddUser,
);

userRouter.get("/all", restrictTo("admin"), adminGetAllUsers);

userRouter.get("/:id", restrictTo("admin"), adminGetUserById);

userRouter.delete("/:id", restrictTo("admin"), adminDeleteUser);

userRouter.patch("/:id", validate(updateUserSchema), updateProfile);

export default userRouter;

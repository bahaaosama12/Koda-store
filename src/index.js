import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./db/connection.js";
import authRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js";
import adminRouter from "./routes/admin.routes.js";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
import orderRouter from "./routes/order.routes.js";
import userRouter from "./routes/user.routes.js";
import productsRouter from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import { handleStripeWebhook } from "./controllers/payment.controllers.js";
import setupSwagger from "./docs/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
setupSwagger(app);

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);
app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/admin", adminRouter);
app.use("/wishlists", wishlistRoutes);
app.use("/api/payments", paymentRouter);
app.use("/payments", paymentRouter);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

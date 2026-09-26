import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Koda E-Commerce Store API",
    version: "1.0.0",
    description:
      "Full REST API documentation for the Koda E-Commerce backend. Covers authentication (OTP-based registration, login, password recovery), user management, product CRUD, reviews, cart operations, orders, wishlists, Stripe payments, and admin dashboard.",
    contact: {
      name: "Koda Team",
    },
    license: {
      name: "ISC",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description:
        "Authentication endpoints — register with OTP, login, logout, password recovery",
    },
    {
      name: "Users",
      description:
        "User management — admin CRUD operations and self-profile update",
    },
    {
      name: "Products",
      description: "Product catalog — browse, search, create, update, delete",
    },
    {
      name: "Reviews",
      description: "Product reviews — add, list, and delete reviews",
    },
    {
      name: "Cart",
      description:
        "Shopping cart — view, add/update/remove items, coupons, clear",
    },
    {
      name: "Orders",
      description: "Customer orders — create, list, view, cancel",
    },
    {
      name: "Wishlist",
      description: "Wishlist — view, add, remove products, clear",
    },
    {
      name: "Payments",
      description:
        "Stripe payments — create payment intent, checkout session, webhook",
    },
    {
      name: "Admin",
      description:
        "Admin panel — dashboard stats, manage orders, carts, wishlists",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Enter JWT token obtained from the /auth/login endpoint. Format: Bearer <token>",
      },
    },
    schemas: {
      // ─── Common ───────────────────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },

      // ─── Address ──────────────────────────────────────────────
      Address: {
        type: "object",
        properties: {
          country: { type: "string", example: "Egypt" },
          city: { type: "string", example: "Cairo" },
          street: { type: "string", example: "15 Tahrir St." },
          postalCode: { type: "string", example: "11511" },
        },
      },

      // ─── User ─────────────────────────────────────────────────
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
          username: { type: "string", example: "john_doe" },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          phone: { type: "string", example: "+201012345678" },
          avatar: { type: "string", format: "uri" },
          role: { type: "string", enum: ["admin", "customer"] },
          addresses: {
            type: "array",
            items: { $ref: "#/components/schemas/Address" },
          },
          wishlist: {
            type: "array",
            items: { type: "string" },
          },
          isVerified: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Product Image ────────────────────────────────────────
      ProductImage: {
        type: "object",
        properties: {
          public_id: {
            type: "string",
            example: "ecommerce-products/abc123",
          },
          url: {
            type: "string",
            format: "uri",
            example:
              "https://res.cloudinary.com/demo/image/upload/v1/products/abc123.jpg",
          },
        },
      },

      // ─── Review ───────────────────────────────────────────────
      Review: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string", description: "User ObjectId" },
          rating: {
            type: "number",
            minimum: 1,
            maximum: 5,
            example: 4,
          },
          comment: {
            type: "string",
            example: "Great product, highly recommend!",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Product ──────────────────────────────────────────────
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "Wireless Headphones" },
          slug: { type: "string", example: "wireless-headphones" },
          shortDescription: {
            type: "string",
            example: "Premium noise-cancelling wireless headphones",
          },
          description: {
            type: "string",
            example: "Full product description here...",
          },
          price: { type: "number", example: 299.99 },
          discountPrice: { type: "number", example: 249.99 },
          stock: { type: "integer", example: 50 },
          sku: { type: "string", example: "WH-001" },
          images: {
            type: "array",
            items: { $ref: "#/components/schemas/ProductImage" },
          },
          category: { type: "string", example: "electronics" },
          subcategory: { type: "string", example: "audio" },
          brand: { type: "string", example: "SoundMax" },
          tags: {
            type: "array",
            items: { type: "string" },
            example: ["wireless", "bluetooth", "noise-cancelling"],
          },
          reviews: {
            type: "array",
            items: { $ref: "#/components/schemas/Review" },
          },
          averageRating: { type: "number", example: 4.5 },
          numReviews: { type: "integer", example: 12 },
          featured: { type: "boolean", example: false },
          isActive: { type: "boolean", example: true },
          createdBy: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Cart Item ────────────────────────────────────────────
      CartItem: {
        type: "object",
        properties: {
          _id: { type: "string" },
          product: { type: "string", description: "Product ObjectId" },
          name: { type: "string", example: "Wireless Headphones" },
          image: { type: "string", format: "uri" },
          price: { type: "number", example: 299.99 },
          quantity: { type: "integer", example: 2 },
        },
      },

      // ─── Coupon ───────────────────────────────────────────────
      Coupon: {
        type: "object",
        properties: {
          code: {
            type: "string",
            enum: ["SAVE10", "SAVE20", "SAVE50", "SAVE80", "OFF50"],
          },
          discountType: {
            type: "string",
            enum: ["percentage", "fixed"],
          },
          discountValue: { type: "number" },
        },
      },

      // ─── Cart Response ────────────────────────────────────────
      CartResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          itemCount: { type: "integer", example: 3 },
          subtotal: { type: "number", example: 899.97 },
          discountAmount: { type: "number", example: 89.99 },
          total: { type: "number", example: 809.98 },
          coupon: {
            type: "string",
            nullable: true,
            example: "SAVE10",
          },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
        },
      },

      // ─── Shipping Address ─────────────────────────────────────
      ShippingAddress: {
        type: "object",
        required: [
          "fullName",
          "phone",
          "country",
          "city",
          "address",
          "postalCode",
        ],
        properties: {
          fullName: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+201012345678" },
          country: { type: "string", example: "Egypt" },
          city: { type: "string", example: "Cairo" },
          address: { type: "string", example: "15 Tahrir Street, Apt 3" },
          postalCode: { type: "string", example: "11511" },
        },
      },

      // ─── Order Item ───────────────────────────────────────────
      OrderItem: {
        type: "object",
        properties: {
          product: { type: "string" },
          name: { type: "string" },
          image: { type: "string", format: "uri" },
          price: { type: "number" },
          quantity: { type: "integer" },
        },
      },

      // ─── Order ────────────────────────────────────────────────
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          shippingAddress: {
            $ref: "#/components/schemas/ShippingAddress",
          },
          paymentMethod: {
            type: "string",
            enum: ["cash", "stripe", "paypal", "paymob"],
          },
          paymentStatus: {
            type: "string",
            enum: ["pending", "paid", "failed", "refunded"],
          },
          transactionId: { type: "string" },
          subtotal: { type: "number" },
          shippingFee: { type: "number" },
          tax: { type: "number" },
          discount: { type: "number" },
          totalPrice: { type: "number" },
          status: {
            type: "string",
            enum: [
              "pending",
              "confirmed",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
              "returned",
            ],
          },
          paidAt: { type: "string", format: "date-time", nullable: true },
          deliveredAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          cancelledAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          customerNote: { type: "string" },
          adminNote: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Wishlist ─────────────────────────────────────────────
      Wishlist: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          products: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  //   PATHS
  // ════════════════════════════════════════════════════════════════
  paths: {
    // ─────────────────────────── AUTH ────────────────────────────
    "/auth/register/send-otp": {
      post: {
        tags: ["Auth"],
        summary: "Register — Send OTP",
        description:
          "Initiates registration by sending a 6-digit OTP to the provided email. The user data is stored temporarily until OTP is verified.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: {
                    type: "string",
                    minLength: 3,
                    maxLength: 20,
                    pattern: "^[a-zA-Z0-9_]+$",
                    example: "john_doe",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    minLength: 8,
                    description:
                      "Must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)",
                    example: "Pass@1234",
                  },
                  phone: {
                    type: "string",
                    pattern: "^(\\+[0-9]{1,3})?[0-9]{7,15}$",
                    example: "+201012345678",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "send OTP to your john@example.com",
                },
              },
            },
          },
          400: {
            description: "Missing fields / Email already exists / OTP expired",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error or failed to send email",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/verify-otp": {
      post: {
        tags: ["Auth"],
        summary: "Register — Verify OTP",
        description:
          "Verifies the OTP sent during registration. On success, the user account is created and marked as verified.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  otp: {
                    type: "string",
                    pattern: "^[0-9]{6}$",
                    example: "123456",
                    description: "6-digit numeric OTP",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "Email verified and user created successfully",
                },
              },
            },
          },
          400: {
            description: "Invalid/expired OTP",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description:
          "Authenticates a user with email and password. Returns a JWT token in both the response body and an httpOnly cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    example: "Pass@1234",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successfully" },
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIs...",
                    },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/forgot-password/send-otp": {
      post: {
        tags: ["Auth"],
        summary: "Forgot Password — Send OTP",
        description:
          "Sends a 6-digit OTP to the user's email for password recovery.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "Password recovery OTP sent successfully",
                },
              },
            },
          },
          404: {
            description: "No user found with this email",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Failed to send email / Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/forgot-password/verify-otp": {
      post: {
        tags: ["Auth"],
        summary: "Forgot Password — Verify OTP & Reset",
        description:
          "Verifies the OTP and resets the user's password to the new one provided.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  otp: {
                    type: "string",
                    pattern: "^[0-9]{6}$",
                    example: "123456",
                  },
                  newPassword: {
                    type: "string",
                    minLength: 8,
                    example: "NewPass@5678",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          400: {
            description: "Invalid/expired OTP",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "OTP not found or user not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        description: "Clears the JWT cookie and logs the user out.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "logged out successfully",
                },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get Current User Profile",
        description: "Returns the profile of the currently authenticated user.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "User profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ─────────────────────────── USERS ───────────────────────────
    "/users/add": {
      post: {
        tags: ["Users"],
        summary: "Admin — Add User",
        description: "Allows an admin to create a new user account directly.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "jane_doe" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "jane@example.com",
                  },
                  password: { type: "string", example: "Pass@1234" },
                  phone: { type: "string", example: "+201098765432" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "User created successfully",
                    },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          400: {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/users/all": {
      get: {
        tags: ["Users"],
        summary: "Admin — Get All Users",
        description: "Returns a list of all users (admin only).",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Users list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer", example: 25 },
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Admin — Get User By ID",
        description: "Returns a single user by ID (admin only).",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "User found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Admin — Delete User",
        description:
          "Deletes a user by ID (admin only). Admin cannot delete their own account.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "User deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "User deleted successfully",
                },
              },
            },
          },
          400: { description: "Admin cannot delete their own account" },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update Own Profile",
        description:
          "Allows the authenticated user to update their own profile. The path `id` must match the logged-in user's ID.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User MongoDB ObjectId (must be the current user)",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                minProperties: 1,
                properties: {
                  username: { type: "string", example: "new_username" },
                  phone: { type: "string", example: "+201055555555" },
                  avatar: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com/avatar.jpg",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Profile updated successfully",
                    },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Can only update own account" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
    },

    // ─────────────────────────── PRODUCTS ────────────────────────
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get All Products",
        description:
          "Returns a paginated, filterable, sortable list of products. No authentication required.",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            description: "Filter by category",
          },
          {
            name: "brand",
            in: "query",
            schema: { type: "string" },
            description: "Filter by brand",
          },
          {
            name: "minPrice",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "maxPrice",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string" },
            description:
              "Sort option (e.g., price_asc, price_desc, newest, rating)",
          },
        ],
        responses: {
          200: {
            description: "Products list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    totalProducts: { type: "integer" },
                    currentPage: { type: "integer" },
                    totalPages: { type: "integer" },
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create Product (Admin)",
        description:
          "Creates a new product with image uploads via multipart/form-data. Admin only.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: [
                  "name",
                  "shortDescription",
                  "description",
                  "price",
                  "stock",
                  "category",
                  "image",
                ],
                properties: {
                  name: { type: "string", maxLength: 200 },
                  shortDescription: { type: "string", maxLength: 500 },
                  description: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  discountPrice: { type: "number", minimum: 0 },
                  stock: { type: "integer", minimum: 0 },
                  sku: { type: "string" },
                  category: { type: "string" },
                  subcategory: { type: "string" },
                  brand: { type: "string" },
                 tags: {
  type: "string",
  description:
    'Optional. Enter tags as an escaped JSON array string, e.g. "[\\"electronics\\", \\"mobile\\", \\"samsung\\"]"',
  example: '"[\\"electronics\\", \\"mobile\\", \\"samsung\\"]"',
},
                  featured: { type: "boolean" },
                  isActive: { type: "boolean" },
                  image: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "Product images (at least 1 required)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Product created successfully",
                    },
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          409: { description: "Product already exists (duplicate name)" },
          500: { description: "Server error" },
        },
      },
    },

    "/products/search": {
      get: {
        tags: ["Products"],
        summary: "Search Products",
        description:
          "Searches products with filters including tags. No authentication required.",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "brand",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "minPrice",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "maxPrice",
            in: "query",
            schema: { type: "number" },
          },
          {
            name: "tags",
            in: "query",
            schema: { type: "string" },
            description: "Comma-separated tags (e.g., wireless,bluetooth)",
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    totalProducts: { type: "integer" },
                    currentPage: { type: "integer" },
                    totalPages: { type: "integer" },
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },

    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get Product By ID",
        description:
          "Returns a single product with all details including reviews. No authentication required.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Product found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete Product (Admin)",
        description:
          "Deletes a product and its images from Cloudinary. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Product deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "Product deleted successfully",
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/products/update/{id}": {
      put: {
        tags: ["Products"],
        summary: "Update Product (Admin)",
        description:
          "Updates an existing product. Supports adding new images and deleting existing ones. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                minProperties: 1,
                properties: {
                  name: { type: "string", maxLength: 200 },
                  shortDescription: { type: "string", maxLength: 500 },
                  description: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  discountPrice: { type: "number", minimum: 0 },
                  stock: { type: "integer", minimum: 0 },
                  sku: { type: "string" },
                  category: { type: "string" },
                  subcategory: { type: "string" },
                  brand: { type: "string" },
                  tags: {
  type: "string",
  description:
    'Optional. Enter tags as an escaped JSON array string, e.g. "[\\"electronics\\", \\"mobile\\", \\"samsung\\"]"',
  example: '"[\\"electronics\\", \\"mobile\\", \\"samsung\\"]"',
},
                  featured: { type: "boolean" },
                  isActive: { type: "boolean" },
                  // deletedImages: {
                  //   type: "string",
                  //   description:
                  //     "Public ID(s) of images to remove from Cloudinary",
                  // },
                  deletedImages: {
  type: "array",
  items: {
    type: "string",
  },
  description: "Public IDs of images to remove from Cloudinary",
  example: [
    "products/image1",
    "products/image2",
  ],
},
                  
                  image: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "New images to add",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Product updated successfully",
                    },
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },

    // ─────────────────────────── REVIEWS ─────────────────────────
    "/products/{productId}/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get Product Reviews",
        description:
          "Returns all reviews for a specific product with average rating. No authentication required.",
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Reviews list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    review: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Review" },
                    },
                    averageRating: { type: "number", example: 4.2 },
                    numReviews: { type: "integer", example: 8 },
                  },
                },
              },
            },
          },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Add Review",
        description:
          "Adds a review to a product. Each user can only review a product once. Requires authentication.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating"],
                properties: {
                  rating: {
                    type: "number",
                    minimum: 1,
                    maximum: 5,
                    example: 4,
                  },
                  comment: {
                    type: "string",
                    example: "Excellent product quality!",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Review added",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "review added successfully",
                    },
                  },
                },
              },
            },
          },
          400: { description: "Already reviewed this product" },
          401: { description: "Not authenticated" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/products/{productId}/reviews/{reviewId}": {
      delete: {
        tags: ["Reviews"],
        summary: "Delete Review",
        description:
          "Deletes a specific review. Only the review author or an admin can delete it.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
          {
            name: "reviewId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Review MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Review deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "review deleted successfully",
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized to delete this review" },
          404: { description: "Product or review not found" },
          500: { description: "Server error" },
        },
      },
    },

    // ─────────────────────────── CART ────────────────────────────
    "/carts": {
      get: {
        tags: ["Cart"],
        summary: "Get or Create Cart",
        description:
          "Returns the current user's cart. Creates a new empty cart if one doesn't exist.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Cart data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" },
              },
            },
          },
          401: { description: "Not authenticated" },
          500: { description: "Server error" },
        },
      },
    },

    "/carts/items": {
      post: {
        tags: ["Cart"],
        summary: "Add Item to Cart",
        description:
          "Adds a product to the cart. If the product already exists, the quantity is incremented.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: {
                  productId: {
                    type: "string",
                    pattern: "^[0-9a-fA-F]{24}$",
                    description: "Product MongoDB ObjectId",
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    default: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Item added to cart",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/CartResponse" },
                    {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "item added to cart successfully",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: {
            description: "Missing productId / Insufficient stock",
          },
          401: { description: "Not authenticated" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      patch: {
        tags: ["Cart"],
        summary: "Update Cart Item Quantity",
        description:
          "Updates the quantity of an existing item in the cart (sets absolute quantity, does not increment).",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: {
                    type: "string",
                    pattern: "^[0-9a-fA-F]{24}$",
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Cart updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" },
              },
            },
          },
          400: {
            description: "Missing fields / Insufficient stock",
          },
          401: { description: "Not authenticated" },
          404: {
            description: "Cart not found / Item not found in cart",
          },
          500: { description: "Server error" },
        },
      },
    },

    "/carts/items/{productId}": {
      delete: {
        tags: ["Cart"],
        summary: "Remove Item from Cart",
        description: "Removes a specific product from the cart.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Item removed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" },
              },
            },
          },
          400: { description: "Missing productId" },
          401: { description: "Not authenticated" },
          404: { description: "Cart or item not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/carts/coupon": {
      post: {
        tags: ["Cart"],
        summary: "Apply Coupon",
        description:
          "Applies a coupon code to the cart. Available codes: SAVE10, SAVE20, SAVE50, SAVE80, OFF50.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code"],
                properties: {
                  code: {
                    type: "string",
                    enum: ["SAVE10", "SAVE20", "SAVE50", "SAVE80", "OFF50"],
                    example: "SAVE10",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Coupon applied",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "coupon applied - you save 10%",
                    },
                    itemCount: { type: "integer" },
                    subtotal: { type: "number" },
                    discountAmount: { type: "number" },
                    total: { type: "number" },
                    coupon: { $ref: "#/components/schemas/Coupon" },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Missing code / Invalid coupon / Cart is empty",
          },
          401: { description: "Not authenticated" },
          404: { description: "Cart not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove Coupon",
        description: "Removes the applied coupon from the cart.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Coupon removed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "coupon removed",
                    },
                    subtotal: { type: "number" },
                    total: { type: "number" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          404: { description: "Cart not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/carts/clear": {
      delete: {
        tags: ["Cart"],
        summary: "Clear Cart",
        description:
          "Removes all items and coupon from the cart.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Cart cleared",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: { success: true, message: "cart cleared" },
              },
            },
          },
          401: { description: "Not authenticated" },
          404: { description: "Cart not found" },
          500: { description: "Server error" },
        },
      },
    },

    // ─────────────────────────── ORDERS ──────────────────────────
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create Order",
        description:
          "Creates a new order from the current cart. Validates stock, deducts quantities, calculates totals (including shipping fee, 14% tax, and any discount), clears the cart, and sends a confirmation email. Uses a MongoDB transaction for atomicity.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shippingAddress"],
                properties: {
                  shippingAddress: {
                    $ref: "#/components/schemas/ShippingAddress",
                  },
                  paymentMethod: {
                    type: "string",
                    enum: ["cash", "stripe", "paypal", "paymob"],
                    default: "cash",
                  },
                  customerNote: {
                    type: "string",
                    maxLength: 1000,
                    example: "Please deliver before 5 PM",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order created and confirmation email sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example:
                        "order confirmation email sent successfully",
                    },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Cart is empty / Insufficient stock / Product inactive",
          },
          401: { description: "Not authenticated" },
          404: { description: "Product not found" },
          500: { description: "Server error / Failed to send email" },
        },
      },
    },

    "/orders/my": {
      get: {
        tags: ["Orders"],
        summary: "Get My Orders",
        description:
          "Returns a paginated list of the current user's orders, optionally filtered by status.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
              ],
            },
            description: "Filter by order status",
          },
        ],
        responses: {
          200: {
            description: "Orders list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    page: { type: "integer" },
                    totalPages: { type: "integer" },
                    totalOrders: { type: "integer" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          500: { description: "Server error" },
        },
      },
    },

    "/orders/my/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get Order By ID",
        description: "Returns a single order by ID for the current user.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Order MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Order details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/orders/my/{id}/cancel": {
      patch: {
        tags: ["Orders"],
        summary: "Cancel Order",
        description:
          "Cancels an order if its status is 'pending' or 'confirmed'. Restores product stock. Uses a MongoDB transaction.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Order MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Order cancelled",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example:
                        "Order cancelled and stock restored successfully",
                    },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Cannot cancel order with current status",
          },
          401: { description: "Not authenticated" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },

    // ─────────────────────────── WISHLIST ────────────────────────
    "/wishlists/my": {
      get: {
        tags: ["Wishlist"],
        summary: "Get My Wishlist",
        description:
          "Returns the current user's wishlist with populated product details. Creates one if it doesn't exist.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Wishlist data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    totalProducts: { type: "integer", example: 5 },
                    wishlist: { $ref: "#/components/schemas/Wishlist" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          500: { description: "Server error" },
        },
      },
    },

    "/wishlists/add/{productId}": {
      post: {
        tags: ["Wishlist"],
        summary: "Add Product to Wishlist",
        description:
          "Adds a product to the user's wishlist. Creates the wishlist if it doesn't exist.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Product added (existing wishlist)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Product added to wishlist successfully",
                    },
                    wishlist: { $ref: "#/components/schemas/Wishlist" },
                  },
                },
              },
            },
          },
          201: {
            description: "Wishlist created with product",
          },
          400: { description: "Product already in wishlist" },
          401: { description: "Not authenticated" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/wishlists/remove/{productId}": {
      delete: {
        tags: ["Wishlist"],
        summary: "Remove Product from Wishlist",
        description: "Removes a specific product from the user's wishlist.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Product MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Product removed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example:
                        "Product removed from wishlist successfully",
                    },
                    wishlist: { $ref: "#/components/schemas/Wishlist" },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          404: {
            description: "Wishlist not found / Product not in wishlist",
          },
          500: { description: "Server error" },
        },
      },
    },

    "/wishlists/clear": {
      delete: {
        tags: ["Wishlist"],
        summary: "Clear Wishlist",
        description: "Removes all products from the user's wishlist.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Wishlist cleared",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
                example: {
                  success: true,
                  message: "Wishlist cleared successfully",
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          404: { description: "Wishlist not found" },
          500: { description: "Server error" },
        },
      },
    },

    // ─────────────────────────── PAYMENTS ────────────────────────
    "/api/payments/create-payment-intent/{orderId}": {
      post: {
        tags: ["Payments"],
        summary: "Create Payment Intent",
        description:
          "Creates a Stripe PaymentIntent for the given order. Returns a client secret for frontend confirmation. The order must belong to the authenticated user and must not already be paid.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Order MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "PaymentIntent created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    clientSecret: {
                      type: "string",
                      example: "pi_xxx_secret_xxx",
                    },
                    transactionId: {
                      type: "string",
                      example: "pi_xxx",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Order already paid / Missing orderId",
          },
          401: { description: "Not authenticated" },
          403: {
            description: "Order doesn't belong to the user",
          },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/api/payments/create-checkout-session/{orderId}": {
      post: {
        tags: ["Payments"],
        summary: "Create Checkout Session",
        description:
          "Creates a Stripe Checkout Session for the given order. Returns a redirect URL to the Stripe-hosted checkout page.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Order MongoDB ObjectId",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  successUrl: {
                    type: "string",
                    format: "uri",
                    description: "Optional custom success redirect URL",
                  },
                  cancelUrl: {
                    type: "string",
                    format: "uri",
                    description: "Optional custom cancel redirect URL",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Checkout Session created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    url: {
                      type: "string",
                      format: "uri",
                      example: "https://checkout.stripe.com/pay/cs_xxx",
                    },
                    sessionId: {
                      type: "string",
                      example: "cs_xxx",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Order already paid / Missing orderId",
          },
          401: { description: "Not authenticated" },
          403: {
            description: "Order doesn't belong to the user",
          },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/api/payments/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Stripe Webhook",
        description:
          "Handles Stripe webhook events (checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed). Automatically updates order payment status. This endpoint requires raw body and is called by Stripe — not by the client.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description: "Stripe webhook event payload",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Webhook processed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    received: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          400: {
            description: "Webhook signature verification failed",
          },
          500: { description: "Server error processing webhook" },
        },
      },
    },

    // ─────────────────────────── ADMIN ───────────────────────────
    "/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Get Dashboard Stats",
        description:
          "Returns comprehensive dashboard statistics including order counts by status, revenue (total, this month, last month, growth %), recent orders, top 10 selling products, orders by status breakdown, daily revenue (last 7 days), and total customer count. Admin only.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    dashboard: {
                      type: "object",
                      properties: {
                        orders: {
                          type: "object",
                          properties: {
                            total: { type: "integer" },
                            pending: { type: "integer" },
                            processing: { type: "integer" },
                            confirmed: { type: "integer" },
                            shipped: { type: "integer" },
                            delivered: { type: "integer" },
                            cancelled: { type: "integer" },
                            returned: { type: "integer" },
                          },
                        },
                        revenue: {
                          type: "object",
                          properties: {
                            total: { type: "number" },
                            thisMonth: { type: "number" },
                            lastMonth: { type: "number" },
                            growthPercent: { type: "number" },
                          },
                        },
                        recentOrders: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Order" },
                        },
                        topProducts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              _id: { type: "string" },
                              name: { type: "string" },
                              image: { type: "string" },
                              totalSold: { type: "integer" },
                              revenue: { type: "number" },
                            },
                          },
                        },
                        ordersByStatus: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              _id: { type: "string" },
                              count: { type: "integer" },
                            },
                          },
                        },
                        dailyRevenue: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                example: "2026-09-15",
                              },
                              revenue: { type: "number" },
                              orders: { type: "integer" },
                            },
                          },
                        },
                        totalCustomers: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/admin/carts": {
      get: {
        tags: ["Admin"],
        summary: "Get Active Carts",
        description:
          "Returns a paginated list of all non-empty carts with user info. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          200: {
            description: "Active carts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    total: { type: "integer" },
                    currentPage: { type: "integer" },
                    totalPages: { type: "integer" },
                    carts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          user: {
                            type: "object",
                            properties: {
                              username: { type: "string" },
                              email: { type: "string" },
                            },
                          },
                          items: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/CartItem",
                            },
                          },
                          subtotal: { type: "number" },
                          itemCount: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/admin": {
      get: {
        tags: ["Admin"],
        summary: "Get All Orders (Admin)",
        description:
          "Returns a paginated, filterable, sortable list of all orders across all users. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
              ],
            },
          },
          {
            name: "paymentStatus",
            in: "query",
            schema: {
              type: "string",
              enum: ["pending", "paid", "failed", "refunded"],
            },
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Start date filter (ISO format)",
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "End date filter (ISO format)",
          },
          {
            name: "sortBy",
            in: "query",
            schema: { type: "string", default: "createdAt" },
            description: "Field to sort by",
          },
          {
            name: "sortDir",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
        ],
        responses: {
          200: {
            description: "Orders list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    total: { type: "integer" },
                    currentPage: { type: "integer" },
                    totalPages: { type: "integer" },
                    orders: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/admin/wishlists": {
      get: {
        tags: ["Admin"],
        summary: "Get All Wishlists (Admin)",
        description:
          "Returns a paginated list of all users' wishlists with product details. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Wishlists list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    total: { type: "integer" },
                    currentPage: { type: "integer" },
                    totalPages: { type: "integer" },
                    wishlists: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Wishlist" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/admin/wishlists/stats": {
      get: {
        tags: ["Admin"],
        summary: "Get Wishlist Statistics (Admin)",
        description:
          "Returns wishlist analytics including total wishlists, total wishlisted products, and top 10 most wishlisted products. Admin only.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Wishlist statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    statistics: {
                      type: "object",
                      properties: {
                        totalWishlists: { type: "integer" },
                        totalWishlistProducts: { type: "integer" },
                        topProducts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              _id: { type: "string" },
                              productId: { type: "string" },
                              count: { type: "integer" },
                              name: { type: "string" },
                              image: { type: "string", format: "uri" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          500: { description: "Server error" },
        },
      },
    },

    "/admin/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get Single Order (Admin)",
        description:
          "Returns full details of a specific order including user info. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Order MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "Order details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid order ID format" },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          404: { description: "Order not found" },
          500: { description: "Server error" },
        },
      },
    },

    "/admin/{id}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Update Order Status (Admin)",
        description:
          "Updates an order's status and optionally adds an admin note. Sends an email notification to the customer. Admin only.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Order MongoDB ObjectId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: [
                      "pending",
                      "confirmed",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                      "returned",
                    ],
                  },
                  adminNote: {
                    type: "string",
                    maxLength: 1000,
                    example:
                      "Order shipped via FedEx, tracking #12345",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order status updated and email sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example:
                        "order status updated to shipped successfully and send email",
                    },
                    order: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid order ID format" },
          401: { description: "Not authenticated" },
          403: { description: "Not authorized (admin only)" },
          404: { description: "Order not found" },
          500: { description: "Server error / Failed to send email" },
        },
      },
    },
  },
};

const swaggerSpec = swaggerDefinition;

/**
 * Sets up Swagger UI at /docs
 * @param {import('express').Application} app - Express application
 */
const setupSwagger = (app) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { font-size: 2.2em; }
      `,
      customSiteTitle: "Koda E-Commerce API Docs",
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
        filter: true,
        tagsSorter: "alpha",
      },
    }),
  );


};

export default setupSwagger;

#  E-commerce Store API

A RESTful E-commerce Backend API built with **Node.js, Express.js, MongoDB, and Mongoose**.

The project includes authentication, OTP verification, products, reviews, wishlist, cart, coupons, orders, Stripe payments, Cloudinary image management, email notifications, and an admin dashboard.

## Features

- **Authentication & Authorization:** JWT, bcrypt, email OTP, forgot-password, role-based access (`customer` / `admin`).
- **Products:** CRUD, search, filtering, pagination, sorting, reviews, ratings, stock management, Cloudinary images.
- **Wishlist:** Add/remove/clear products with duplicate protection.
- **Cart:** Add/update/remove items, coupons, calculated totals.
- **Orders:** Cash & Stripe orders, stock validation, cancellation, order snapshots.
- **Payments:** Stripe PaymentIntent and verified webhooks.
- **Email:** Registration OTP, password recovery, order confirmation and status emails.
- **Admin:** User/order/cart/wishlist management and dashboard statistics using MongoDB aggregation.
- **Validation & Security:** Joi validation, JWT protection, RBAC, webhook signature verification, environment-based secrets.

## Tech Stack

- Node.js / Express.js
- MongoDB / Mongoose
- JWT / bcryptjs
- Joi
- Nodemailer
- Cloudinary / Multer
- Stripe
- Swagger
- Morgan / CORS

## Project Structure

```text
E-commerce-back-end/
├── public/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── docs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validation/
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas or another MongoDB deployment
- Cloudinary account for product images
- Gmail SMTP/App Password for email features
- Stripe account for online payments

## Installation

```bash
git clone https://github.com/bahaaosama12/Koda-store.git
cd Koda-store
npm install
```

Create a `.env` file in the project root using `.env.example`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URL=

JWT_SECRET=
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=egp
```

Then start the server:

```bash
npm start
```

Default URL:

```text
http://localhost:5000
```

## API Documentation

Swagger documentation is available at:

```text
http://localhost:5000/api-docs
```

It contains the available endpoints, request formats, authentication requirements, and API responses.

## Main API Routes

| Module | Base Route | Main Purpose |
|---|---|---|
| Auth | `/auth` | Register, OTP, login, logout, profile, password recovery |
| Users | `/users` | User management and profile updates |
| Products | `/products` | Product CRUD, search, filtering and reviews |
| Cart | `/carts` | Cart items and coupons |
| Wishlist | `/wishlists` | Wishlist management |
| Orders | `/orders` | Create, view and cancel customer orders |
| Admin | `/admin` | Dashboard and administrative operations |
| Payments | `/api/payments` | Stripe payment operations and webhooks |

Protected requests use:

```http
Authorization: Bearer <your_token>
```

## Important Business Logic

### Cart & Stock

Adding a product to the cart **does not deduct stock**. Stock is checked when adding/updating the cart and deducted only when an order is successfully created.

Order creation uses a **MongoDB transaction** to atomically:

1. Validate stock
2. Deduct stock
3. Create the order
4. Clear the cart

If the transaction fails, the changes are rolled back.

### Orders

Orders store product snapshots such as name, image, price, and quantity. This keeps historical orders valid even if the original product is later deleted.

Eligible order cancellation restores the purchased stock using a transaction.

### Product Images

Product images are uploaded to Cloudinary and stored with their `public_id` and URL. Images can be added/deleted during product updates, and product deletion removes its Cloudinary images.

### Stripe

Stripe payments use PaymentIntents. Webhook signatures are verified before processing payment events.

Webhook endpoints:

```text
POST /api/payments/webhook
POST /payments/webhook
```

## Security

- Passwords are hashed with `bcryptjs`.
- JWT protects authenticated routes.
- Admin routes use role-based authorization.
- Joi validates incoming data.
- Stripe webhook signatures are verified.
- Secrets are stored in `.env` and excluded from Git.

**Never commit `.env` or real API credentials.** Use `.env.example` as the public template.


## Author
**Bahaa Osama** — Backend / MERN Stack Developer

`Node.js` `Express.js` `MongoDB` `Mongoose` `JWT` `Joi` `Cloudinary` `Nodemailer` `Stripe`